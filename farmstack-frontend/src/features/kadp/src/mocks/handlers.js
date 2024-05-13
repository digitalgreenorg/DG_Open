import { connectorHandler } from "./handlers/connectorHandler";
import { dashboardHandler } from "./handlers/dashboardHandler";
import { datasetHandler } from "./handlers/datasetHandler";
import { datasetRequestHandler } from "./handlers/datasetRequestHandler";
import { legalHandler } from "./handlers/legalHandler";
import { loginHandler } from "./handlers/loginHandler";
import { micrositeHandler } from "./handlers/micrositeHandler";
import { onboardingHandler } from "./handlers/onboardingHandler";
import { otherHandler } from "./handlers/otherHandler";
import { participantHandler } from "./handlers/participantHandler";
import { settingHandler } from "./handlers/settingHandler";
import { supportTicketHandler } from "./handlers/supportTicketHandler";

// Add your handler inside the array...
export const handlers = [
  ...micrositeHandler,
  ...loginHandler,
  ...dashboardHandler,
  ...onboardingHandler,
  ...datasetHandler,
  ...participantHandler,
  ...connectorHandler,
  ...settingHandler,
  ...supportTicketHandler,
  ...otherHandler,
  ...legalHandler,
  ...datasetRequestHandler,
];
