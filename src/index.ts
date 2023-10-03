import { BullMQSuite } from "./bullmq-suite";
import { log } from "./log";

const runSuites = async () => {
  log.title("Start running benchmark suites\n");

  const bullMQSuite = new BullMQSuite();

  await bullMQSuite.run();

  log.success("Finished running suites");
};

runSuites().catch(error => {
  console.error(error);
});
