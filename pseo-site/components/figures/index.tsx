import SignalTimeline from "./SignalTimeline";
import SignalTypes from "./SignalTypes";
import LeadTimeComparison from "./LeadTimeComparison";
import ScreeningChecklist from "./ScreeningChecklist";

const figureRegistry: Record<string, React.ComponentType> = {
  "signal-timeline": SignalTimeline,
  "signal-types": SignalTypes,
  "lead-time-comparison": LeadTimeComparison,
  "screening-checklist": ScreeningChecklist,
};

export default figureRegistry;
