import { getPassageFromReference } from "./app/utils/bible";

getPassageFromReference("Mateo 11, 25-30").then((r) => {
  console.log("Resultado:", JSON.stringify(r));
});