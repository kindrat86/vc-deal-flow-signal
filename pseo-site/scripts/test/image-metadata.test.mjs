import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import test from 'node:test';
import ts from 'typescript';

const ROOT = process.cwd();
const LICENSE = 'https://creativecommons.org/licenses/by/4.0/';
const CREDIT = 'VC Deal Flow Signal (GitDealFlow)';

function sourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(?:ts|tsx)$/.test(path) && !/\.test\.tsx?$/.test(path) ? [path] : [];
  }).sort();
}

// Parse TypeScript rather than matching braces: nested creator references and
// template literal URLs must not borrow a parent's or sibling's license.
function imageNodes(text, file = 'fixture.tsx') {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const nodes = [];
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const assignments = node.properties.filter(ts.isPropertyAssignment);
      const props = new Map(assignments.map(prop => [prop.name.text, prop.initializer]));
      const duplicates = assignments.map(prop => prop.name.text)
        .filter((name, index, names) => names.indexOf(name) !== index);
      const type = props.get('@type');
      if (type && ts.isStringLiteral(type) && type.text === 'ImageObject') {
        const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
        nodes.push({ file, line, props, duplicates });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return nodes;
}

function missingFields(node) {
  const failures = (node.duplicates ?? []).map(key => `duplicate ${key}`);
  for (const [key, expected] of [['license', LICENSE], ['creditText', CREDIT]]) {
    const value = node.props.get(key);
    if (!value || !ts.isStringLiteral(value) || value.text !== expected) failures.push(key);
  }
  // Preserve the fields from the preceding GSC repair as well.
  for (const key of ['copyrightNotice', 'creator', 'acquireLicensePage']) {
    if (!node.props.has(key)) failures.push(key);
  }
  return failures;
}

const complete = '"@type":"ImageObject",license:"' + LICENSE + '",creditText:"' + CREDIT +
  '",copyrightNotice:"Copyright GitDealFlow",creator:{"@id":"https://signals.gitdealflow.com/about#person"},acquireLicensePage:"https://signals.gitdealflow.com/terms"';

test('image fields must belong to the image, not a parent or sibling', () => {
  const nodes = imageNodes('const schema={license:"' + LICENSE + '",creditText:"' + CREDIT +
    '",image:{"@type":"ImageObject",url:`${SITE}/image`},logo:{' + complete + '}};');
  assert.equal(nodes.length, 2);
  assert.ok(missingFields(nodes[0]).includes('license'));
  assert.ok(missingFields(nodes[0]).includes('creditText'));
  assert.deepEqual(missingFields(nodes[1]), []);
});

test('each required image metadata field is independently enforced', () => {
  const node = imageNodes('const schema={' + complete + '};')[0];
  assert.deepEqual(missingFields(node), []);
  for (const key of ['license', 'creditText', 'copyrightNotice', 'creator', 'acquireLicensePage']) {
    const props = new Map(node.props);
    props.delete(key);
    assert.ok(missingFields({ ...node, props }).includes(key), key);
  }
});

test('every site ImageObject has its own license and creditText', () => {
  const nodes = ['app', 'components', 'lib', 'content'].flatMap(dir =>
    sourceFiles(join(ROOT, dir)).flatMap(file => imageNodes(readFileSync(file, 'utf8'), relative(ROOT, file))));
  assert.ok(nodes.length >= 28, `Expected at least 28 image definitions, found ${nodes.length}`);
  const failures = nodes.flatMap(node => {
    const missing = missingFields(node);
    return missing.length ? [`${node.file}:${node.line}: missing/incorrect ${missing.join(', ')}`] : [];
  });
  assert.deepEqual(failures, [], `${nodes.length} ImageObject definitions checked:\n${failures.join('\n')}`);
});
