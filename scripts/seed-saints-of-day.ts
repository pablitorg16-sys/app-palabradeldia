import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const saints = [
  // 2026-08-02
  {
    date: "2026-08-02",
    name: "San Eusebio de Vercelli",
    role: "Obispo",
    birth_year: "c. 283",
    birth_place: "Cerdeña (Italia)",
    death_year: "371",
    death_place: "Vercelli (Italia)",
    summary:
      "El primer obispo de Vercelli, Eusebio, nombrado en el 345, era originario de Cerdeña. El más grande defensor del Credo de Nicea atrajo la hostilidad de los arrianos, incluso del Emperador Constancio que lo exilió a Capadocia en 355. A su regreso a Vercelli 7 años después, reanudó la evangelización.",
    order_index: 1,
  },
  {
    date: "2026-08-02",
    name: "San Esteban I",
    role: "Papa",
    birth_year: "c. 200",
    birth_place: "Roma (Italia)",
    death_year: "257",
    death_place: "Roma (Italia)",
    summary:
      "Papa desde 254, fue muy caritativo con los cristianos que, a causa de la persecución, habían renegado de su fe en Jesús. Se opuso a la costumbre de rebautizar a los creyentes que regresaban a la fe después de las herejías. Según la tradición, murió como mártir en la persecución de Valeriano del 257.",
    order_index: 2,
  },
  {
    date: "2026-08-02",
    name: "San Pedro Juliano Eymard",
    role: "Fundador de los Sacramentinos",
    birth_year: "1811",
    birth_place: "Isère (Francia)",
    death_year: "1868",
    death_place: "Isère (Francia)",
    summary:
      "San Pedro Julián Eymard, Apóstol de la Eucaristía, es recordado cada año por la Iglesia el 2 de agosto. Fundador de los sacramentinos e inspirador de los Congresos eucarísticos, este santo hizo del amor por Cristo, contemplado en el altar, el centro de su vida.",
    order_index: 3,
  },
  // 2026-08-03
  {
    date: "2026-08-03",
    name: "Santa Lidia",
    role: "Discípula de San Pablo",
    birth_year: null,
    birth_place: "Tiatira (Turquía actual)",
    death_year: null,
    death_place: null,
    summary:
      "Su habitación fue la primera iglesia en Europa fundada por San Pablo. Cuando el Apóstol llega a Filipos en Macedonia, encuentra hospitalidad en la casa de esta recién convertida al Evangelio junto con toda su familia. Su historia se encuentra en el capítulo 16 de los Hechos de los Apóstoles.",
    order_index: 1,
  },
  // 2026-08-04
  {
    date: "2026-08-04",
    name: "San Juan María Vianney",
    role: "Sacerdote, Cura de Ars",
    birth_year: "1786",
    birth_place: "Ródano (Francia)",
    death_year: "1859",
    death_place: "Ain (Francia)",
    summary:
      "Juan María Vianney, el Cura de Ars, vivió a mediados del siglo XIX. Ejemplo de gran celo sacerdotal, dedicó su ministerio a la salvación de las almas transcurriendo aún hasta 16 horas al día en el Sacramento de la Reconciliación y el Perdón. Benedicto XVI le dedicó el Año Sacerdotal 2009.",
    order_index: 1,
  },
  // 2026-08-05
  {
    date: "2026-08-05",
    name: "San Osvaldo",
    role: "Rey de Northumbria, mártir",
    birth_year: "c. 604",
    birth_place: "Northumbria (Reino Unido)",
    death_year: "642",
    death_place: "Shropshire (Reino Unido)",
    summary:
      "En Maserfield (o Oswestry), Inglaterra, Osvaldo rey de Northumbria, fue un distinguido militar que buscó difundir la fe cristiana en la región no solo por medio de la paz sino también por la fuerza de la guerra. Murió en 642 en batalla contra el rey pagano Penda. Por eso fue venerado como mártir.",
    order_index: 1,
  },
  // 2026-08-06
  {
    date: "2026-08-06",
    name: "San Hormisdas",
    role: "Papa",
    birth_year: "c. 450",
    birth_place: "Frosinone (Italia)",
    death_year: "523",
    death_place: "Roma (Italia)",
    summary:
      "Hormisdas, originario de Frosinone, fue un diácono viudo con un hijo que también sería Papa. Fue elegido en 514 y se le recuerda sobre todo por la reconciliación entre las Iglesias de Roma y Constantinopla después del cisma de Acacio. La confesión de fe tomó el nombre de 'Fórmula de Ormisda'.",
    order_index: 1,
  },
];

async function main() {
  console.log(`Insertando ${saints.length} santos...`);

  const { error } = await supabase.from("saints_of_day").insert(saints);

  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }

  console.log("Insertados correctamente.");
}

main();
