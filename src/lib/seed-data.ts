import type { NewCrmAccount } from "./types";

export type SeedCompany = {
  empresa: string;
  sector: string;
  tamano_estimado: string;
  ciudad: string;
  gancho: string;
  senal: string;
};

/** 20 empresas net-new de arranque, para que la app no parta vacía. */
export const SEED_NET_NEW: SeedCompany[] = [
  {
    "empresa": "Carozzi",
    "sector": "Alimentos y consumo masivo",
    "tamano_estimado": "7.000–9.000",
    "ciudad": "Nos, San Bernardo",
    "gancho": "Gran dotación operaria + fuerza de venta; onboarding, seguridad y liderazgo de planta.",
    "senal": "Expansión de categorías y foco exportador."
  },
  {
    "empresa": "Watt's",
    "sector": "Alimentos y lácteos",
    "tamano_estimado": "2.500–3.500",
    "ciudad": "Casablanca / Santiago",
    "gancho": "Plantas productivas; seguridad y liderazgo de supervisores de línea.",
    "senal": ""
  },
  {
    "empresa": "Colún",
    "sector": "Lácteos (cooperativa)",
    "tamano_estimado": "4.000–5.000",
    "ciudad": "La Unión, Los Ríos",
    "gancho": "Cooperativa regional grande, poco penetrada por L&D digital; formación de mandos medios.",
    "senal": "Crecimiento sostenido de la categoría láctea."
  },
  {
    "empresa": "Forus",
    "sector": "Retail calzado y vestuario",
    "tamano_estimado": "3.000–4.000",
    "ciudad": "Santiago",
    "gancho": "Red multimarca de tiendas; venta retail y liderazgo de tienda.",
    "senal": ""
  },
  {
    "empresa": "Tricot",
    "sector": "Retail moda",
    "tamano_estimado": "~3.000",
    "ciudad": "Santiago",
    "gancho": "Fuerza de venta y servicio en tienda; foco en productividad.",
    "senal": "Retail ajustando dotación → prioridad en eficiencia."
  },
  {
    "empresa": "Finning (Caterpillar) Chile",
    "sector": "Maquinaria y servicios mineros",
    "tamano_estimado": "4.000–5.000",
    "ciudad": "Santiago + norte",
    "gancho": "Técnicos y operaciones mineras; upskilling técnico + liderazgo de terreno.",
    "senal": "Demanda minera alta → presión por mantención y talento técnico."
  },
  {
    "empresa": "Molymet",
    "sector": "Procesamiento de metales (molibdeno)",
    "tamano_estimado": "1.000–1.500",
    "ciudad": "San Bernardo",
    "gancho": "Industrial especializada; seguridad y competencias técnicas.",
    "senal": "Multinacional con plantas fuera de Chile (posible cuenta árbol)."
  },
  {
    "empresa": "Aguas Andinas",
    "sector": "Sanitaria / utilities",
    "tamano_estimado": "2.000–3.000",
    "ciudad": "Santiago",
    "gancho": "Servicio esencial con base operativa amplia; seguridad, liderazgo y transformación digital.",
    "senal": "Presión regulatoria y foco en eficiencia."
  },
  {
    "empresa": "Colbún",
    "sector": "Generación eléctrica",
    "tamano_estimado": "1.000–1.400",
    "ciudad": "Santiago",
    "gancho": "Transición energética; reskilling técnico y liderazgo.",
    "senal": "Inversión fuerte en renovables."
  },
  {
    "empresa": "Consorcio",
    "sector": "Seguros y servicios financieros",
    "tamano_estimado": "2.500–3.500",
    "ciudad": "Santiago",
    "gancho": "Fuerza comercial grande; ventas, cumplimiento y liderazgo.",
    "senal": ""
  },
  {
    "empresa": "Tanner Servicios Financieros",
    "sector": "Finanzas no bancarias",
    "tamano_estimado": "1.200–1.800",
    "ciudad": "Santiago",
    "gancho": "Equipos comerciales en crecimiento; onboarding y compliance.",
    "senal": ""
  },
  {
    "empresa": "Salfacorp",
    "sector": "Construcción e inmobiliario",
    "tamano_estimado": "10.000+",
    "ciudad": "Santiago",
    "gancho": "Enorme dotación en obra; seguridad, supervisión y liderazgo de terreno.",
    "senal": "Reactivación de proyectos."
  },
  {
    "empresa": "CAP",
    "sector": "Acero y minería de hierro",
    "tamano_estimado": "3.000–5.000",
    "ciudad": "Santiago / Huachipato / norte",
    "gancho": "Reconversión industrial; reskilling técnico y liderazgo.",
    "senal": "Reestructuración de la siderurgia → reconversión de talento."
  },
  {
    "empresa": "SAAM",
    "sector": "Logística portuaria y remolcadores",
    "tamano_estimado": "3.000+",
    "ciudad": "Santiago",
    "gancho": "Operación regional; seguridad y liderazgo operativo.",
    "senal": "Presencia en varios países (candidata a cuenta árbol)."
  },
  {
    "empresa": "Blue Express",
    "sector": "Courier / logística e-commerce",
    "tamano_estimado": "2.000–3.000",
    "ciudad": "Santiago",
    "gancho": "Crecimiento e-commerce; formación operativa y servicio.",
    "senal": "Auge de la última milla."
  },
  {
    "empresa": "WOM",
    "sector": "Telecomunicaciones",
    "tamano_estimado": "1.500–2.500",
    "ciudad": "Santiago",
    "gancho": "Cultura joven y alta rotación; onboarding, ventas y liderazgo.",
    "senal": "Relanzamiento tras reestructuración financiera."
  },
  {
    "empresa": "Sonda",
    "sector": "TI y servicios tecnológicos",
    "tamano_estimado": "6.000+ (región)",
    "ciudad": "Santiago",
    "gancho": "Multinacional tech chilena; upskilling y liderazgo, muy alineado con learning digital.",
    "senal": "Presencia en 10+ países (fuerte candidata a cuenta árbol)."
  },
  {
    "empresa": "Clínica Alemana",
    "sector": "Salud",
    "tamano_estimado": "3.000–4.000",
    "ciudad": "Santiago",
    "gancho": "Personal clínico y administrativo; servicio, liderazgo y cumplimiento.",
    "senal": ""
  },
  {
    "empresa": "Viña Concha y Toro",
    "sector": "Vinos / agroexport",
    "tamano_estimado": "3.000+ (Chile)",
    "ciudad": "Santiago / Pirque",
    "gancho": "Marca global con fuerza comercial internacional; idiomas, ventas y liderazgo.",
    "senal": "Presencia en múltiples países (candidata a cuenta árbol)."
  },
  {
    "empresa": "Multi X",
    "sector": "Salmón / acuicultura",
    "tamano_estimado": "2.500–3.500",
    "ciudad": "Puerto Montt",
    "gancho": "Industria salmonera con foco en certificación de competencias; formación técnica y liderazgo de planta.",
    "senal": "Industria en récord de utilidades y recontratando (2025)."
  }
];

/**
 * Negocios ya trabajados por el AE en HubSpot (corte 20-ago-2026).
 * Sirven para dos cosas:
 *   1. Excluirlos de los lotes generados con Claude (no repetir cuentas).
 *   2. Los que están "In" alimentan el frente de Cuentas árbol.
 */
export const SEED_CRM_ACCOUNTS: NewCrmAccount[] = [
  {
    "empresa": "Agencia de Aduanas Browne",
    "estado_crm": "In",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/20160373294"
  },
  {
    "empresa": "AgenciaSE",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8243106332"
  },
  {
    "empresa": "Agrosuper",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/31646282247"
  },
  {
    "empresa": "Aguas Nuevas",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/56468730650"
  },
  {
    "empresa": "AGUNSA CHILE",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7922956857"
  },
  {
    "empresa": "AlfaPeople",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/6015683883"
  },
  {
    "empresa": "Aliservice Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7709340461"
  },
  {
    "empresa": "Anagra",
    "estado_crm": "In",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8400621896"
  },
  {
    "empresa": "Applus+ Chile",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/9133229214"
  },
  {
    "empresa": "Arauco",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/6865672121"
  },
  {
    "empresa": "Ascensores Heavenward",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8916341778"
  },
  {
    "empresa": "Atlas Copco Chile",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/17705649159"
  },
  {
    "empresa": "AZA Acero Sostenible",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7137744135"
  },
  {
    "empresa": "Azerta",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/9515597346"
  },
  {
    "empresa": "Badamax",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8950809254"
  },
  {
    "empresa": "BAILAC",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7098387834"
  },
  {
    "empresa": "Banco BICE S.A",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/44331485350"
  },
  {
    "empresa": "Bata Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7857659458"
  },
  {
    "empresa": "Bci Seguros",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7064766261"
  },
  {
    "empresa": "BDO CHILE",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8829910142"
  },
  {
    "empresa": "BRITISH AMERICAN TOBACCO",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7785538440"
  },
  {
    "empresa": "Buses JM",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/6852077201"
  },
  {
    "empresa": "Caleta Bay",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/9337813008"
  },
  {
    "empresa": "Cartocor - Grupo Arcor",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8127791445"
  },
  {
    "empresa": "CGS",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8442560321"
  },
  {
    "empresa": "Cheil Worldwide Inc.",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/1062414993"
  },
  {
    "empresa": "Chilquinta Energía S.A.",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/6949941105"
  },
  {
    "empresa": "CIAL Alimentos S.A.",
    "estado_crm": "Opportunity",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7318562433"
  },
  {
    "empresa": "Claro Chile",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/22069687915"
  },
  {
    "empresa": "Coca-Cola Embonor Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7058277923"
  },
  {
    "empresa": "Colmena Seguros Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/39289455390"
  },
  {
    "empresa": "Consorcio",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/1116952384"
  },
  {
    "empresa": "Cooprinsem",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8071433637"
  },
  {
    "empresa": "Corrupac",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8777999370"
  },
  {
    "empresa": "CPT",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8387852892"
  },
  {
    "empresa": "Cruzados",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/4530139162"
  },
  {
    "empresa": "DEGASA Holding Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8610579296"
  },
  {
    "empresa": "Distribuidora Internacional de Alimentación, S.A.",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/2540247369"
  },
  {
    "empresa": "DSV - Global Transport and Logistics Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/5969977953"
  },
  {
    "empresa": "ECM ingeniería",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/9815448640"
  },
  {
    "empresa": "Empresas CMPC S.A",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7914436181"
  },
  {
    "empresa": "Empresas TAYLOR",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/3173526123"
  },
  {
    "empresa": "Enaex",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/6817536797"
  },
  {
    "empresa": "Enorchile S.A.",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/15394543800"
  },
  {
    "empresa": "Essbio",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/9355193192"
  },
  {
    "empresa": "FARMACIAS SIMILARES CH",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7730715463"
  },
  {
    "empresa": "FedEx (SOUTH CONE)",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8817584133"
  },
  {
    "empresa": "FID Seguros",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7468083811"
  },
  {
    "empresa": "Gemco General Machinery",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/6952234395"
  },
  {
    "empresa": "Gourmet Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7044361804"
  },
  {
    "empresa": "Grafton",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/9582952040"
  },
  {
    "empresa": "Grupo EULEN Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7174170689"
  },
  {
    "empresa": "Grupo Gtd Chile",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/40602542675"
  },
  {
    "empresa": "Grupo Maclean",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/10539715933"
  },
  {
    "empresa": "Grupo Patio",
    "estado_crm": "In",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/2900697359"
  },
  {
    "empresa": "Grupo Refax",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/14928449289"
  },
  {
    "empresa": "Grupo Saesa",
    "estado_crm": "SQL / Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/2365352142"
  },
  {
    "empresa": "Grupo Valdivieso",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/54509310364"
  },
  {
    "empresa": "Hortifrut Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/1193274488"
  },
  {
    "empresa": "IDIEM",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8827699752"
  },
  {
    "empresa": "Indemin",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7916416588"
  },
  {
    "empresa": "Inelcom Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/50094602113"
  },
  {
    "empresa": "Inmobiliaria Habita",
    "estado_crm": "In",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7047277830"
  },
  {
    "empresa": "Integra Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/16795031188"
  },
  {
    "empresa": "Intercarry Logística",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8923289230"
  },
  {
    "empresa": "Inversiones XR3",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/55338813314"
  },
  {
    "empresa": "Isapre Colmena",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7064768834"
  },
  {
    "empresa": "JOHNSON & JOHNSON CH",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/35655626909"
  },
  {
    "empresa": "Johnson Controls - enterprise",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/759168200"
  },
  {
    "empresa": "Jorquera Transporte SA",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/10426857356"
  },
  {
    "empresa": "Kaufmann",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8127991714"
  },
  {
    "empresa": "Lagardere",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/53592742210"
  },
  {
    "empresa": "Lecomp Group",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/26586463789"
  },
  {
    "empresa": "Lemontech Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7040877147"
  },
  {
    "empresa": "Liderman Chile",
    "estado_crm": "In",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7658476452"
  },
  {
    "empresa": "Maicao",
    "estado_crm": "In",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/6775040887"
  },
  {
    "empresa": "Mascotas Latinas",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7157233228"
  },
  {
    "empresa": "MEGA",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7580986031"
  },
  {
    "empresa": "Metso Outotec chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8337203050"
  },
  {
    "empresa": "Multi X",
    "estado_crm": "SQL / Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/3137230095"
  },
  {
    "empresa": "Museo Interactivo Mirador",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/9905909366"
  },
  {
    "empresa": "Odfjellterminals",
    "estado_crm": "In",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/17556249178"
  },
  {
    "empresa": "omega-servicios",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7926125211"
  },
  {
    "empresa": "Palumbo (Global Beauty SpA)",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/53579003744"
  },
  {
    "empresa": "Parque del Recuerdo Chile",
    "estado_crm": "SQL / Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7023033748"
  },
  {
    "empresa": "Paz Corp",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/29372359593"
  },
  {
    "empresa": "Pedro de Valdivia",
    "estado_crm": "In",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8792464437"
  },
  {
    "empresa": "PepsiCo Inc",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7776866343"
  },
  {
    "empresa": "Polpaico",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/2156237572"
  },
  {
    "empresa": "Pompeyo Carrasco",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/9368060847"
  },
  {
    "empresa": "Porsche Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/6622875059"
  },
  {
    "empresa": "Primacap",
    "estado_crm": "In",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/22729521970"
  },
  {
    "empresa": "Promedon",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/4888422669"
  },
  {
    "empresa": "Prosegur Chile",
    "estado_crm": "SQL / Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/41298727499"
  },
  {
    "empresa": "Quant Service",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/9764417040"
  },
  {
    "empresa": "Quillayes - Surlat",
    "estado_crm": "In",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/9500337249"
  },
  {
    "empresa": "RBU",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/15024076383"
  },
  {
    "empresa": "Red Megacentro (HOLDING logistica: Megalogistica, Megacentro, Empresas Mega)",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/15638290611"
  },
  {
    "empresa": "Redbanc",
    "estado_crm": "In",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7797584440"
  },
  {
    "empresa": "Redsalud (Red Salud)",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/6951826023"
  },
  {
    "empresa": "Renta 4 Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/29796759948"
  },
  {
    "empresa": "Salmones Austral S.A.-pacific Star",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8442545714"
  },
  {
    "empresa": "Santiago Metro",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/5139591238"
  },
  {
    "empresa": "Santillana Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8031623215"
  },
  {
    "empresa": "Schindler CHILE",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8314968674"
  },
  {
    "empresa": "Serviphar",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/9810254504"
  },
  {
    "empresa": "SKIC Oficina Central",
    "estado_crm": "In / Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8593915919"
  },
  {
    "empresa": "SKIC Proyectos",
    "estado_crm": "In",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/55405440548"
  },
  {
    "empresa": "SMU",
    "estado_crm": "In / Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8418906508"
  },
  {
    "empresa": "Sotraser S.A.",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8324508334"
  },
  {
    "empresa": "Starken Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7143824493"
  },
  {
    "empresa": "STRABAG /Züblin",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7899151872"
  },
  {
    "empresa": "Sugal-Group",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7975795543"
  },
  {
    "empresa": "Sun Chemical",
    "estado_crm": "In",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/1154317512"
  },
  {
    "empresa": "Tarpulin",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/9385986143"
  },
  {
    "empresa": "Tarragona",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7940819077"
  },
  {
    "empresa": "TCI GECOMP",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/9657679224"
  },
  {
    "empresa": "TECK CHILE",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/3268752810"
  },
  {
    "empresa": "The Singular Hotels",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/9515544098"
  },
  {
    "empresa": "Thiess Chile",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8818783111"
  },
  {
    "empresa": "Tigo Chile",
    "estado_crm": "In",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/32781053872"
  },
  {
    "empresa": "Total Energies",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/5573133721"
  },
  {
    "empresa": "TOYOTA CH",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/2825178654"
  },
  {
    "empresa": "TPS",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/54896176736"
  },
  {
    "empresa": "Transbank",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/6623091088"
  },
  {
    "empresa": "TREX",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/4906260033"
  },
  {
    "empresa": "Universidad Mayor Chile",
    "estado_crm": "SQL",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8752549225"
  },
  {
    "empresa": "Uno Salud Dental",
    "estado_crm": "In",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7177415863"
  },
  {
    "empresa": "Upcom DTS CallCenter",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/10869166372"
  },
  {
    "empresa": "vecchiola.cl",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/8073825202"
  },
  {
    "empresa": "Veolia Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/7104679327"
  },
  {
    "empresa": "Voy Santiago",
    "estado_crm": "Opportunity / Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/9462793525"
  },
  {
    "empresa": "WOM Chile",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/1755584762"
  },
  {
    "empresa": "Yeppo",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/28486739384"
  },
  {
    "empresa": "ZerviZ",
    "estado_crm": "Lost",
    "hubspot_url": "https://app.hubspot.com/go-to/3296735/0-2/9515682352"
  }
];

/** Clientes ganados (etapa "In"): base para expandir por relación caliente. */
export const CLIENTES_IN = SEED_CRM_ACCOUNTS.filter((c) =>
  c.estado_crm.split("/").some((e) => e.trim() === "In"),
).map((c) => c.empresa);
