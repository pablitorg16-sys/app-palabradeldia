import { getPassageFromReference } from "./app/utils/bible";

getPassageFromReference("Mateo 9, 36-10, 8").then((r) => {
  console.log("Resultado:", r.slice(0, 100));
});