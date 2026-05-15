export interface Question {
  text: string;
  options: string[];
  correctIndex: number;
  category: string;
  difficulty: string;
}

export const QUESTION_BANK: Question[] = [
  // Tecnología
  {
    text: "¿Cuántos bytes tiene un kilobyte?",
    options: ["512", "1024", "2048", "256"],
    correctIndex: 1,
    category: "Tecnología",
    difficulty: "Fácil"
  },
  {
    text: "¿Qué significa HTTP?",
    options: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Transmission Process", "Hosted Text Transfer Protocol"],
    correctIndex: 0,
    category: "Tecnología",
    difficulty: "Medio"
  },
  {
    text: "¿Cuál es el lenguaje de programación más usado en desarrollo web frontend?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correctIndex: 2,
    category: "Tecnología",
    difficulty: "Fácil"
  },
  {
    text: "¿Qué estructura de datos usa FIFO (primero en entrar, primero en salir)?",
    options: ["Pila (Stack)", "Cola (Queue)", "Árbol", "Grafo"],
    correctIndex: 1,
    category: "Programación",
    difficulty: "Medio"
  },
  {
    text: "¿Qué significa SQL?",
    options: ["Structured Query Language", "Simple Query Logic", "Standard Question List", "System Query Language"],
    correctIndex: 0,
    category: "Programación",
    difficulty: "Fácil"
  },
  {
    text: "¿Cuál de estos NO es un tipo de dato primitivo en JavaScript?",
    options: ["string", "boolean", "array", "number"],
    correctIndex: 2,
    category: "Programación",
    difficulty: "Medio"
  },
  {
    text: "¿Qué protocolo se usa para enviar correos electrónicos?",
    options: ["FTP", "SSH", "SMTP", "HTTP"],
    correctIndex: 2,
    category: "Tecnología",
    difficulty: "Medio"
  },
  {
    text: "¿Cuál es el sistema operativo más usado en servidores web?",
    options: ["Windows Server", "macOS", "Linux", "Android"],
    correctIndex: 2,
    category: "Tecnología",
    difficulty: "Medio"
  },
  {
    text: "¿Qué significa CSS?",
    options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Coded Style Structure"],
    correctIndex: 1,
    category: "Tecnología",
    difficulty: "Fácil"
  },
  {
    text: "¿Cuántos bits tiene un byte?",
    options: ["4", "16", "8", "32"],
    correctIndex: 2,
    category: "Tecnología",
    difficulty: "Fácil"
  },
  {
    text: "¿Qué empresa desarrolló el lenguaje de programación Java?",
    options: ["Microsoft", "Apple", "Sun Microsystems", "IBM"],
    correctIndex: 2,
    category: "Tecnología",
    difficulty: "Medio"
  },
  {
    text: "¿Cuál es la complejidad temporal de la búsqueda binaria?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    correctIndex: 2,
    category: "Programación",
    difficulty: "Difícil"
  },

  // Ciencia
  {
    text: "¿Cuál es la fórmula química del agua?",
    options: ["CO2", "H2O", "O2", "NaCl"],
    correctIndex: 1,
    category: "Ciencia",
    difficulty: "Fácil"
  },
  {
    text: "¿Cuántos planetas tiene el sistema solar?",
    options: ["7", "8", "9", "10"],
    correctIndex: 1,
    category: "Ciencia",
    difficulty: "Fácil"
  },
  {
    text: "¿A qué velocidad viaja la luz en el vacío?",
    options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "100,000 km/s"],
    correctIndex: 0,
    category: "Ciencia",
    difficulty: "Medio"
  },
  {
    text: "¿Cuál es el elemento más abundante en la corteza terrestre?",
    options: ["Hierro", "Carbono", "Oxígeno", "Silicio"],
    correctIndex: 2,
    category: "Ciencia",
    difficulty: "Medio"
  },
  {
    text: "¿Quién formuló la teoría de la relatividad?",
    options: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Stephen Hawking"],
    correctIndex: 1,
    category: "Ciencia",
    difficulty: "Fácil"
  },
  {
    text: "¿Cuántos cromosomas tiene una célula humana normal?",
    options: ["23", "44", "46", "48"],
    correctIndex: 2,
    category: "Ciencia",
    difficulty: "Medio"
  },
  {
    text: "¿Cuál es el símbolo químico del oro?",
    options: ["Go", "Or", "Au", "Ag"],
    correctIndex: 2,
    category: "Ciencia",
    difficulty: "Fácil"
  },
  {
    text: "¿Qué planeta es conocido como el planeta rojo?",
    options: ["Venus", "Júpiter", "Saturno", "Marte"],
    correctIndex: 3,
    category: "Ciencia",
    difficulty: "Fácil"
  },

  // Geografía
  {
    text: "¿Cuál es la capital de El Salvador?",
    options: ["San Miguel", "San Salvador", "Santa Ana", "Sonsonate"],
    correctIndex: 1,
    category: "Geografía",
    difficulty: "Fácil"
  },
  {
    text: "¿Cuál es el río más largo del mundo?",
    options: ["Amazonas", "Nilo", "Yangtsé", "Misisipi"],
    correctIndex: 1,
    category: "Geografía",
    difficulty: "Medio"
  },
  {
    text: "¿Cuántos países forman Centroamérica?",
    options: ["5", "6", "7", "8"],
    correctIndex: 2,
    category: "Geografía",
    difficulty: "Medio"
  },
  {
    text: "¿Cuál es el país más grande del mundo por superficie?",
    options: ["China", "Estados Unidos", "Canadá", "Rusia"],
    correctIndex: 3,
    category: "Geografía",
    difficulty: "Fácil"
  },
  {
    text: "¿En qué continente se encuentra Egipto?",
    options: ["Asia", "Europa", "África", "Medio Oriente"],
    correctIndex: 2,
    category: "Geografía",
    difficulty: "Fácil"
  },
  {
    text: "¿Cuál es la montaña más alta del mundo?",
    options: ["K2", "Monte Everest", "Kilimanjaro", "Aconcagua"],
    correctIndex: 1,
    category: "Geografía",
    difficulty: "Fácil"
  },

  // Historia
  {
    text: "¿En qué año llegó Cristóbal Colón a América?",
    options: ["1488", "1490", "1492", "1495"],
    correctIndex: 2,
    category: "Historia",
    difficulty: "Fácil"
  },
  {
    text: "¿Cuál fue la primera civilización de la historia?",
    options: ["Egipcia", "Romana", "Sumeria", "Griega"],
    correctIndex: 2,
    category: "Historia",
    difficulty: "Difícil"
  },
  {
    text: "¿En qué año terminó la Segunda Guerra Mundial?",
    options: ["1943", "1944", "1945", "1946"],
    correctIndex: 2,
    category: "Historia",
    difficulty: "Fácil"
  },
  {
    text: "¿Quién fue el primer presidente de los Estados Unidos?",
    options: ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "John Adams"],
    correctIndex: 2,
    category: "Historia",
    difficulty: "Fácil"
  },
  {
    text: "¿En qué año El Salvador firmó los Acuerdos de Paz?",
    options: ["1990", "1991", "1992", "1993"],
    correctIndex: 2,
    category: "Historia SV",
    difficulty: "Medio"
  },

  // Arte y Cultura
  {
    text: "¿Quién pintó la Mona Lisa?",
    options: ["Miguel Ángel", "Rafael", "Leonardo da Vinci", "Botticelli"],
    correctIndex: 2,
    category: "Arte",
    difficulty: "Fácil"
  },
  {
    text: "¿Quién escribió 'Cien años de soledad'?",
    options: ["Mario Vargas Llosa", "Pablo Neruda", "Gabriel García Márquez", "Jorge Luis Borges"],
    correctIndex: 2,
    category: "Literatura",
    difficulty: "Medio"
  },
  {
    text: "¿En qué país se originó el deporte del fútbol moderno?",
    options: ["Brasil", "España", "Inglaterra", "Alemania"],
    correctIndex: 2,
    category: "Deportes",
    difficulty: "Medio"
  },
  {
    text: "¿Cuántos jugadores tiene un equipo de fútbol en el campo?",
    options: ["9", "10", "11", "12"],
    correctIndex: 2,
    category: "Deportes",
    difficulty: "Fácil"
  },
  {
    text: "¿Cuál es el instrumento de cuerda más grande de una orquesta?",
    options: ["Violín", "Viola", "Cello", "Contrabajo"],
    correctIndex: 3,
    category: "Arte",
    difficulty: "Difícil"
  },

  // UFG y Universidad
  {
    text: "¿En qué año fue fundada la Universidad Francisco Gavidia?",
    options: ["1981", "1992", "1995", "1978"],
    correctIndex: 0,
    category: "UFG",
    difficulty: "Medio"
  },
  {
    text: "¿En qué ciudad está la sede principal de la UFG?",
    options: ["Santa Ana", "San Miguel", "San Salvador", "Sonsonate"],
    correctIndex: 2,
    category: "UFG",
    difficulty: "Fácil"
  },
  {
    text: "¿Qué es un crédito académico universitario?",
    options: [
      "El pago de una materia",
      "La unidad de medida del trabajo académico",
      "Un bono de descuento",
      "El número de materias por ciclo"
    ],
    correctIndex: 1,
    category: "Universidad",
    difficulty: "Fácil"
  },
  {
    text: "¿Qué significa GPA en el contexto universitario?",
    options: ["General Performance Average", "Grade Point Average", "Global Progress Assessment", "General Points Achieved"],
    correctIndex: 1,
    category: "Universidad",
    difficulty: "Medio"
  },

  // ── Tecnología (adicionales) ──────────────────────────────────────────────
  { text: "¿Qué significa RAM?", options: ["Read Access Memory", "Random Access Memory", "Rapid Application Mode", "Remote Allocation Module"], correctIndex: 1, category: "Tecnología", difficulty: "Fácil" },
  { text: "¿Cuántos bits tiene una dirección IPv4?", options: ["16", "32", "64", "128"], correctIndex: 1, category: "Tecnología", difficulty: "Medio" },
  { text: "¿Qué significa API?", options: ["Applied Programming Instance", "Automated Process Integration", "Application Programming Interface", "Advanced Protocol Interface"], correctIndex: 2, category: "Tecnología", difficulty: "Medio" },
  { text: "¿Qué es Git?", options: ["Un lenguaje de programación", "Un sistema operativo", "Un framework de JavaScript", "Un sistema de control de versiones"], correctIndex: 3, category: "Tecnología", difficulty: "Fácil" },
  { text: "¿Cuál es la extensión de un archivo JavaScript?", options: [".java", ".py", ".js", ".ts"], correctIndex: 2, category: "Tecnología", difficulty: "Fácil" },
  { text: "¿Qué empresa desarrolló el sistema operativo Android?", options: ["Apple", "Microsoft", "Google", "Samsung"], correctIndex: 2, category: "Tecnología", difficulty: "Fácil" },
  { text: "¿Qué significa IoT?", options: ["Internet of Tasks", "Interface of Technology", "Integration of Tools", "Internet of Things"], correctIndex: 3, category: "Tecnología", difficulty: "Medio" },
  { text: "¿Cuántas capas tiene el modelo OSI?", options: ["5", "6", "7", "8"], correctIndex: 2, category: "Tecnología", difficulty: "Difícil" },
  { text: "¿Qué significa URL?", options: ["Universal Resource Link", "Unified Remote Library", "Uniform Resource Locator", "User Request Layer"], correctIndex: 2, category: "Tecnología", difficulty: "Fácil" },
  { text: "¿Cuál es el lenguaje de marcado estándar para páginas web?", options: ["CSS", "PHP", "JavaScript", "HTML"], correctIndex: 3, category: "Tecnología", difficulty: "Fácil" },
  { text: "¿Qué lenguaje de programación es más usado en inteligencia artificial?", options: ["Java", "C++", "PHP", "Python"], correctIndex: 3, category: "Tecnología", difficulty: "Medio" },
  { text: "¿Qué es un algoritmo?", options: ["Un tipo de virus informático", "Un lenguaje de programación", "Un componente de hardware", "Una secuencia de instrucciones para resolver un problema"], correctIndex: 3, category: "Tecnología", difficulty: "Fácil" },

  // ── Programación (adicionales) ────────────────────────────────────────────
  { text: "¿Qué es la recursividad en programación?", options: ["Copiar código de otra función", "Repetir instrucciones con un for", "Llamar múltiples funciones al mismo tiempo", "Una función que se llama a sí misma"], correctIndex: 3, category: "Programación", difficulty: "Medio" },
  { text: "¿Qué significa POO?", options: ["Proceso Orientado a Objetos", "Programación Orientada a Objetos", "Protocolo de Objetos Ordenados", "Programa de Operaciones Online"], correctIndex: 1, category: "Programación", difficulty: "Fácil" },
  { text: "¿Qué es JSON?", options: ["Java Syntax Object Network", "JavaScript Object Notation", "JavaScript Online Node", "Joint System Object Naming"], correctIndex: 1, category: "Programación", difficulty: "Fácil" },
  { text: "¿Qué significa CRUD en programación?", options: ["Create, Run, Update, Delete", "Create, Read, Update, Delete", "Copy, Read, Use, Deploy", "Compile, Run, Update, Debug"], correctIndex: 1, category: "Programación", difficulty: "Fácil" },
  { text: "¿Qué símbolo se usa para comentar una línea en Python?", options: ["//", "/* */", "--", "#"], correctIndex: 3, category: "Programación", difficulty: "Fácil" },
  { text: "¿Cuál es la complejidad de BubbleSort en el peor caso?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correctIndex: 2, category: "Programación", difficulty: "Difícil" },
  { text: "¿Qué framework de JavaScript fue creado por Meta (Facebook)?", options: ["Angular", "Vue", "React", "Svelte"], correctIndex: 2, category: "Programación", difficulty: "Medio" },
  { text: "¿Cuál es el operador lógico AND en JavaScript?", options: ["&", "||", "!", "&&"], correctIndex: 3, category: "Programación", difficulty: "Fácil" },
  { text: "¿Qué patrón de diseño separa la app en Modelo, Vista y Controlador?", options: ["MVP", "MVVM", "MVC", "REST"], correctIndex: 2, category: "Programación", difficulty: "Medio" },
  { text: "¿Qué es un compilador?", options: ["Un editor de código", "Un depurador de errores", "Un programa que convierte código fuente a código máquina", "Un gestor de bases de datos"], correctIndex: 2, category: "Programación", difficulty: "Medio" },

  // ── Ciencia (adicionales) ─────────────────────────────────────────────────
  { text: "¿Cuál es la unidad de medida de la fuerza en el Sistema Internacional?", options: ["Julio", "Pascal", "Newton", "Watt"], correctIndex: 2, category: "Ciencia", difficulty: "Medio" },
  { text: "¿Cuántos elementos tiene la tabla periódica actualmente?", options: ["108", "112", "118", "124"], correctIndex: 2, category: "Ciencia", difficulty: "Medio" },
  { text: "¿Cuál es el gas más abundante en la atmósfera terrestre?", options: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Argón"], correctIndex: 2, category: "Ciencia", difficulty: "Medio" },
  { text: "¿A qué temperatura hierve el agua al nivel del mar?", options: ["90°C", "95°C", "100°C", "110°C"], correctIndex: 2, category: "Ciencia", difficulty: "Fácil" },
  { text: "¿Qué partícula subatómica tiene carga eléctrica negativa?", options: ["Protón", "Neutrón", "Electrón", "Positrón"], correctIndex: 2, category: "Ciencia", difficulty: "Fácil" },
  { text: "¿Cuántos huesos tiene el cuerpo humano adulto?", options: ["186", "196", "206", "216"], correctIndex: 2, category: "Ciencia", difficulty: "Medio" },
  { text: "¿Cuál es la unidad básica de corriente eléctrica?", options: ["Voltio", "Watt", "Amperio", "Ohmio"], correctIndex: 2, category: "Ciencia", difficulty: "Medio" },
  { text: "¿Qué proceso permite a las plantas convertir luz solar en energía?", options: ["Respiración celular", "Metabolismo", "Osmosis", "Fotosíntesis"], correctIndex: 3, category: "Ciencia", difficulty: "Fácil" },
  { text: "¿Qué es el ADN?", options: ["Adenosina De Nucleótidos", "Ácido Dinitroaminado", "Ácido Dextro Nucleático", "Ácido Desoxirribonucleico"], correctIndex: 3, category: "Ciencia", difficulty: "Medio" },
  { text: "¿Quién formuló la ley de la gravitación universal?", options: ["Galileo Galilei", "Albert Einstein", "Nikola Tesla", "Isaac Newton"], correctIndex: 3, category: "Ciencia", difficulty: "Fácil" },
  { text: "¿Qué órgano del cuerpo humano produce insulina?", options: ["Hígado", "Riñón", "Estómago", "Páncreas"], correctIndex: 3, category: "Ciencia", difficulty: "Medio" },

  // ── Geografía (adicionales) ───────────────────────────────────────────────
  { text: "¿Cuántos continentes hay en el mundo?", options: ["5", "6", "7", "8"], correctIndex: 2, category: "Geografía", difficulty: "Fácil" },
  { text: "¿Cuál es el océano más grande del mundo?", options: ["Atlántico", "Índico", "Ártico", "Pacífico"], correctIndex: 3, category: "Geografía", difficulty: "Fácil" },
  { text: "¿Cuál es la ciudad más poblada del mundo?", options: ["Shanghai", "Nueva York", "Tokio", "Mumbai"], correctIndex: 2, category: "Geografía", difficulty: "Medio" },
  { text: "¿En qué país se encuentra la Torre Eiffel?", options: ["Italia", "España", "Francia", "Alemania"], correctIndex: 2, category: "Geografía", difficulty: "Fácil" },
  { text: "¿Cuál es la capital de Japón?", options: ["Osaka", "Kioto", "Hiroshima", "Tokio"], correctIndex: 3, category: "Geografía", difficulty: "Fácil" },
  { text: "¿Cuál es el país más pequeño del mundo?", options: ["Mónaco", "San Marino", "Ciudad del Vaticano", "Liechtenstein"], correctIndex: 2, category: "Geografía", difficulty: "Medio" },
  { text: "¿Cuántos países forman América del Sur?", options: ["10", "11", "12", "13"], correctIndex: 2, category: "Geografía", difficulty: "Medio" },
  { text: "¿En qué continente está Brasil?", options: ["América Central", "América del Norte", "América del Sur", "África"], correctIndex: 2, category: "Geografía", difficulty: "Fácil" },

  // ── Historia (adicionales) ────────────────────────────────────────────────
  { text: "¿En qué año llegó el ser humano a la luna por primera vez?", options: ["1965", "1967", "1969", "1971"], correctIndex: 2, category: "Historia", difficulty: "Fácil" },
  { text: "¿Quién fue el primer astronauta en pisar la luna?", options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "John Glenn"], correctIndex: 2, category: "Historia", difficulty: "Fácil" },
  { text: "¿En qué año cayó el Muro de Berlín?", options: ["1987", "1988", "1989", "1991"], correctIndex: 2, category: "Historia", difficulty: "Medio" },
  { text: "¿En qué año comenzó la Primera Guerra Mundial?", options: ["1912", "1913", "1914", "1916"], correctIndex: 2, category: "Historia", difficulty: "Medio" },
  { text: "¿Quién inventó la imprenta de tipos móviles?", options: ["Leonardo da Vinci", "Galileo Galilei", "Johannes Gutenberg", "Isaac Newton"], correctIndex: 2, category: "Historia", difficulty: "Medio" },
  { text: "¿En qué año se firmó la Declaración de Independencia de Estados Unidos?", options: ["1774", "1775", "1776", "1778"], correctIndex: 2, category: "Historia", difficulty: "Medio" },

  // ── Arte y Literatura (adicionales) ──────────────────────────────────────
  { text: "¿Quién escribió 'Don Quijote de la Mancha'?", options: ["Lope de Vega", "Francisco de Quevedo", "Miguel de Cervantes", "García Lorca"], correctIndex: 2, category: "Literatura", difficulty: "Fácil" },
  { text: "¿Quién pintó 'La noche estrellada'?", options: ["Pablo Picasso", "Claude Monet", "Salvador Dalí", "Vincent van Gogh"], correctIndex: 3, category: "Arte", difficulty: "Fácil" },
  { text: "¿Quién compuso la Quinta Sinfonía?", options: ["Mozart", "Bach", "Beethoven", "Chopin"], correctIndex: 2, category: "Arte", difficulty: "Medio" },
  { text: "¿Qué obra de Shakespeare trata sobre un príncipe danés?", options: ["Macbeth", "Otelo", "Romeo y Julieta", "Hamlet"], correctIndex: 3, category: "Literatura", difficulty: "Medio" },
  { text: "¿En qué año se publicó el primer libro de Harry Potter?", options: ["1995", "1996", "1997", "1998"], correctIndex: 2, category: "Literatura", difficulty: "Medio" },
  { text: "¿Cuántos colores tiene el espectro visible del arcoíris?", options: ["5", "6", "7", "8"], correctIndex: 2, category: "Ciencia", difficulty: "Fácil" },
  { text: "¿Quién escribió 'Crónica de una muerte anunciada'?", options: ["Mario Vargas Llosa", "Pablo Neruda", "Gabriel García Márquez", "Jorge Luis Borges"], correctIndex: 2, category: "Literatura", difficulty: "Medio" },

  // ── Deportes (adicionales) ────────────────────────────────────────────────
  { text: "¿Qué país ha ganado más Copas del Mundo de fútbol?", options: ["Alemania", "Argentina", "Italia", "Brasil"], correctIndex: 3, category: "Deportes", difficulty: "Fácil" },
  { text: "¿En qué deporte se usa el término 'home run'?", options: ["Softball", "Cricket", "Béisbol", "Kickball"], correctIndex: 2, category: "Deportes", difficulty: "Fácil" },
  { text: "¿Cuántos jugadores hay en cancha en un equipo de baloncesto?", options: ["4", "5", "6", "7"], correctIndex: 1, category: "Deportes", difficulty: "Fácil" },
  { text: "¿En qué país se originaron los primeros Juegos Olímpicos?", options: ["Roma", "Egipto", "Grecia", "Persia"], correctIndex: 2, category: "Deportes", difficulty: "Fácil" },
  { text: "¿Cuántos puntos vale un touchdown en fútbol americano?", options: ["3", "4", "6", "7"], correctIndex: 2, category: "Deportes", difficulty: "Medio" },
  { text: "¿Cuál es el deporte más practicado en el mundo?", options: ["Básquetbol", "Tenis", "Natación", "Fútbol"], correctIndex: 3, category: "Deportes", difficulty: "Fácil" },

  // ── Matemáticas ───────────────────────────────────────────────────────────
  { text: "¿Cuánto es la raíz cuadrada de 144?", options: ["11", "12", "13", "14"], correctIndex: 1, category: "Matemáticas", difficulty: "Fácil" },
  { text: "¿Cuántos grados tiene la suma de los ángulos internos de un triángulo?", options: ["90°", "120°", "180°", "360°"], correctIndex: 2, category: "Matemáticas", difficulty: "Fácil" },
  { text: "¿Cuál de estos números es primo?", options: ["9", "15", "17", "21"], correctIndex: 2, category: "Matemáticas", difficulty: "Medio" },
  { text: "¿Cuánto es 2 elevado a la décima potencia?", options: ["512", "1024", "2048", "4096"], correctIndex: 1, category: "Matemáticas", difficulty: "Medio" },
  { text: "¿Cuántos lados tiene un hexágono?", options: ["5", "6", "7", "8"], correctIndex: 1, category: "Matemáticas", difficulty: "Fácil" },
  { text: "¿Cuánto es el 25% de 200?", options: ["25", "40", "50", "75"], correctIndex: 2, category: "Matemáticas", difficulty: "Fácil" },

  // ── Cultura General ───────────────────────────────────────────────────────
  { text: "¿Qué significa PIB?", options: ["Precio Industrial Básico", "Producto Interno Bruto", "Porcentaje de Inversión Bancaria", "Promedio de Ingresos Básicos"], correctIndex: 1, category: "Economía", difficulty: "Medio" },
  { text: "¿Qué significa FODA en análisis empresarial?", options: ["Fortalezas, Objetivos, Debilidades, Amenazas", "Fortalezas, Oportunidades, Debilidades, Amenazas", "Funciones, Operaciones, Datos, Análisis", "Factores, Oportunidades, Decisiones, Acciones"], correctIndex: 1, category: "Economía", difficulty: "Medio" },
  { text: "¿Qué significa TIC en educación?", options: ["Tecnologías de Integración Computacional", "Tecnologías de la Información y Comunicación", "Técnicas de Innovación Científica", "Teoría de Información y Cibernética"], correctIndex: 1, category: "Universidad", difficulty: "Fácil" },
  { text: "¿Qué país produce más café en el mundo?", options: ["Colombia", "Vietnam", "Brasil", "Etiopía"], correctIndex: 2, category: "Geografía", difficulty: "Difícil" },
  { text: "¿Cuántas horas tiene una semana?", options: ["148", "158", "168", "178"], correctIndex: 2, category: "Matemáticas", difficulty: "Fácil" },
  { text: "¿En qué año se fundó Google?", options: ["1996", "1997", "1998", "2000"], correctIndex: 2, category: "Tecnología", difficulty: "Medio" },
  { text: "¿Qué significa USB?", options: ["Universal Serial Bus", "Unified System Bridge", "Universal Sync Bridge", "Unified Serial Board"], correctIndex: 0, category: "Tecnología", difficulty: "Fácil" },
  { text: "¿Cuál es el lenguaje oficial de Brasil?", options: ["Español", "Inglés", "Portugués", "Francés"], correctIndex: 2, category: "Geografía", difficulty: "Fácil" },

  // ── POO ───────────────────────────────────────────────────────────────────
  { text: "¿Cuántos pilares tiene la Programación Orientada a Objetos?", options: ["2", "3", "4", "5"], correctIndex: 2, category: "POO", difficulty: "Fácil" },
  { text: "¿Qué pilar de la POO permite que una clase adquiera características de otra?", options: ["Encapsulación", "Herencia", "Polimorfismo", "Abstracción"], correctIndex: 1, category: "POO", difficulty: "Fácil" },
  { text: "¿Qué es encapsulación en POO?", options: ["Crear múltiples instancias de una clase", "Ocultar datos internos y exponer solo lo necesario", "Heredar métodos de una clase padre", "Crear clases sin implementación"], correctIndex: 1, category: "POO", difficulty: "Medio" },
  { text: "¿Qué es polimorfismo en POO?", options: ["Ocultar atributos de una clase", "Crear subclases de una clase padre", "Capacidad de un objeto de comportarse de múltiples formas", "Definir métodos sin implementación"], correctIndex: 2, category: "POO", difficulty: "Medio" },
  { text: "¿Qué es una clase en POO?", options: ["Una variable global del programa", "Una función que devuelve valores", "Una instancia de un objeto en memoria", "Una plantilla o molde para crear objetos"], correctIndex: 3, category: "POO", difficulty: "Fácil" },
  { text: "¿Qué es un constructor en POO?", options: ["Un método que destruye objetos", "Un método especial que inicializa un objeto al crearlo", "Una clase que hereda de otra", "Un tipo de variable estática"], correctIndex: 1, category: "POO", difficulty: "Fácil" },
  { text: "¿Qué es una interfaz en POO?", options: ["Una clase con todos sus métodos implementados", "Un tipo de variable especial", "Un contrato que define métodos sin implementación", "Una función que retorna objetos"], correctIndex: 2, category: "POO", difficulty: "Medio" },
  { text: "¿Qué es abstracción en POO?", options: ["Copiar el comportamiento de otra clase", "Crear múltiples objetos iguales", "Simplificar la complejidad ocultando detalles innecesarios", "Conectar dos clases entre sí"], correctIndex: 2, category: "POO", difficulty: "Medio" },
  { text: "¿Qué palabra clave se usa en Java para heredar de una clase?", options: ["implements", "inherits", "super", "extends"], correctIndex: 3, category: "POO", difficulty: "Medio" },
  { text: "¿Qué es un objeto en POO?", options: ["Una función del programa", "Una instancia de una clase", "Un archivo del proyecto", "Un tipo de dato primitivo"], correctIndex: 1, category: "POO", difficulty: "Fácil" },
  { text: "¿Qué tipo de herencia permite que una clase herede de múltiples clases?", options: ["Herencia simple", "Herencia múltiple", "Herencia abstracta", "Herencia estática"], correctIndex: 1, category: "POO", difficulty: "Medio" },
  { text: "¿Qué es un método abstracto?", options: ["Un método privado", "Un método sin parámetros", "Un método que no puede sobreescribirse", "Un método declarado sin implementación"], correctIndex: 3, category: "POO", difficulty: "Difícil" },

  // ── Estructuras de Datos ──────────────────────────────────────────────────
  { text: "¿Qué significa LIFO en estructuras de datos?", options: ["Last Input First Output", "Last In First Out", "Linked Index For Objects", "Linear Input Fixed Output"], correctIndex: 1, category: "Estructuras de Datos", difficulty: "Fácil" },
  { text: "¿Qué significa FIFO?", options: ["First In First Out", "Final Input For Output", "Fixed Index For Operations", "First Input Final Output"], correctIndex: 0, category: "Estructuras de Datos", difficulty: "Fácil" },
  { text: "¿Qué estructura de datos usa LIFO?", options: ["Cola (Queue)", "Lista enlazada", "Pila (Stack)", "Árbol binario"], correctIndex: 2, category: "Estructuras de Datos", difficulty: "Fácil" },
  { text: "¿Qué estructura de datos usa FIFO?", options: ["Pila (Stack)", "Cola (Queue)", "Árbol AVL", "Grafo"], correctIndex: 1, category: "Estructuras de Datos", difficulty: "Fácil" },
  { text: "¿Cuál es la operación que agrega un elemento a una pila?", options: ["Enqueue", "Add", "Push", "Insert"], correctIndex: 2, category: "Estructuras de Datos", difficulty: "Medio" },
  { text: "¿Cuál es la operación que elimina el elemento tope de una pila?", options: ["Dequeue", "Pop", "Remove", "Delete"], correctIndex: 1, category: "Estructuras de Datos", difficulty: "Medio" },
  { text: "¿Qué es una lista enlazada?", options: ["Un arreglo de tamaño fijo", "Una tabla de claves y valores", "Una estructura donde cada nodo apunta al siguiente", "Un árbol con múltiples hijos"], correctIndex: 2, category: "Estructuras de Datos", difficulty: "Medio" },
  { text: "¿Cuántos hijos puede tener como máximo un nodo en un árbol binario?", options: ["1", "2", "3", "4"], correctIndex: 1, category: "Estructuras de Datos", difficulty: "Fácil" },
  { text: "¿Qué es una tabla hash?", options: ["Un árbol de búsqueda equilibrado", "Una lista de elementos ordenados", "Una estructura que mapea claves a valores mediante una función hash", "Una cola de prioridad"], correctIndex: 2, category: "Estructuras de Datos", difficulty: "Medio" },
  { text: "¿Cuál es la complejidad promedio de búsqueda en una tabla hash?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctIndex: 3, category: "Estructuras de Datos", difficulty: "Medio" },
  { text: "¿Qué es un grafo en estructuras de datos?", options: ["Un árbol binario con múltiples raíces", "Una colección de nodos conectados por aristas", "Una lista de elementos sin orden", "Una tabla de doble entrada"], correctIndex: 1, category: "Estructuras de Datos", difficulty: "Medio" },
  { text: "¿Qué tipo de recorrido de árbol visita: izquierda → raíz → derecha?", options: ["Preorden", "Postorden", "Inorden", "Por niveles"], correctIndex: 2, category: "Estructuras de Datos", difficulty: "Difícil" },
  { text: "¿Qué es un árbol AVL?", options: ["Un árbol con todos los nodos en el mismo nivel", "Un árbol binario de búsqueda autobalanceable", "Un grafo sin ciclos", "Un árbol donde los hijos son siempre mayores que el padre"], correctIndex: 1, category: "Estructuras de Datos", difficulty: "Difícil" },

  // ── Algoritmos ────────────────────────────────────────────────────────────
  { text: "¿Cuál es la complejidad de MergeSort en todos sus casos?", options: ["O(n)", "O(n²)", "O(n log n)", "O(log n)"], correctIndex: 2, category: "Algoritmos", difficulty: "Medio" },
  { text: "¿Qué algoritmo divide el arreglo en dos mitades y las combina ordenadas?", options: ["BubbleSort", "InsertionSort", "SelectionSort", "MergeSort"], correctIndex: 3, category: "Algoritmos", difficulty: "Medio" },
  { text: "¿Cuál es la complejidad de QuickSort en el caso promedio?", options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], correctIndex: 1, category: "Algoritmos", difficulty: "Medio" },
  { text: "¿Para qué escenario es más eficiente InsertionSort?", options: ["Arreglos grandes y desordenados", "Arreglos casi ordenados", "Arreglos con muchos duplicados", "Arreglos de cadenas de texto"], correctIndex: 1, category: "Algoritmos", difficulty: "Difícil" },
  { text: "¿Qué requisito necesita la búsqueda binaria para funcionar?", options: ["El arreglo debe tener tamaño par", "Los elementos deben ser numéricos", "El arreglo debe estar ordenado", "El arreglo debe caber en memoria caché"], correctIndex: 2, category: "Algoritmos", difficulty: "Fácil" },
  { text: "¿Cuál es la complejidad de la búsqueda binaria?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correctIndex: 2, category: "Algoritmos", difficulty: "Medio" },
  { text: "¿Qué significa O(1) en notación Big O?", options: ["El algoritmo tarda 1 segundo", "El tiempo depende del tamaño de entrada", "El tiempo es constante sin importar el tamaño", "El algoritmo realiza solo 1 operación"], correctIndex: 2, category: "Algoritmos", difficulty: "Medio" },
  { text: "¿Cuál es el peor caso de QuickSort?", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], correctIndex: 2, category: "Algoritmos", difficulty: "Difícil" },
  { text: "¿Qué algoritmo de ordenamiento es estable con complejidad O(n log n)?", options: ["QuickSort", "HeapSort", "MergeSort", "SelectionSort"], correctIndex: 2, category: "Algoritmos", difficulty: "Difícil" },
  { text: "¿Cuál es la complejidad de SelectionSort?", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], correctIndex: 2, category: "Algoritmos", difficulty: "Medio" },
  { text: "¿Qué algoritmo de búsqueda revisa elemento por elemento secuencialmente?", options: ["Búsqueda binaria", "Búsqueda hash", "Búsqueda en árbol", "Búsqueda lineal"], correctIndex: 3, category: "Algoritmos", difficulty: "Fácil" },
  { text: "¿Qué es la recursión en algoritmos?", options: ["Un bucle que se repite n veces", "Una técnica donde una función se llama a sí misma", "Un algoritmo que nunca termina", "Una estructura de datos circular"], correctIndex: 1, category: "Algoritmos", difficulty: "Fácil" },

  // ── Bases de Datos ────────────────────────────────────────────────────────
  { text: "¿Qué es una llave primaria (Primary Key)?", options: ["Un campo que puede repetirse", "Un campo que referencia otra tabla", "Un identificador único para cada registro", "Un campo de solo lectura"], correctIndex: 2, category: "Bases de Datos", difficulty: "Fácil" },
  { text: "¿Qué es una llave foránea (Foreign Key)?", options: ["Un campo que identifica únicamente cada registro", "Un campo que referencia la llave primaria de otra tabla", "Un índice de búsqueda rápida", "Un campo encriptado"], correctIndex: 1, category: "Bases de Datos", difficulty: "Medio" },
  { text: "¿Qué significa ACID en bases de datos?", options: ["Atomicidad, Consistencia, Aislamiento, Durabilidad", "Acceso, Control, Integridad, Disponibilidad", "Autenticación, Cifrado, Indexación, Distribución", "Archivo, Conexión, Inserción, Datos"], correctIndex: 0, category: "Bases de Datos", difficulty: "Difícil" },
  { text: "¿Qué es normalización en bases de datos?", options: ["Aumentar el rendimiento de consultas", "Organizar datos para reducir redundancia e inconsistencias", "Encriptar los datos de la base", "Crear índices en todas las tablas"], correctIndex: 1, category: "Bases de Datos", difficulty: "Medio" },
  { text: "¿Qué comando SQL se usa para obtener datos de una tabla?", options: ["INSERT", "UPDATE", "DELETE", "SELECT"], correctIndex: 3, category: "Bases de Datos", difficulty: "Fácil" },
  { text: "¿Qué hace un JOIN en SQL?", options: ["Inserta múltiples filas a la vez", "Ordena los resultados de una consulta", "Combina filas de dos o más tablas relacionadas", "Crea una nueva tabla"], correctIndex: 2, category: "Bases de Datos", difficulty: "Medio" },

  // ── Patrones de Diseño ────────────────────────────────────────────────────
  { text: "¿Qué garantiza el patrón de diseño Singleton?", options: ["Que una clase pueda tener múltiples instancias", "Que una clase tenga solo una instancia en toda la aplicación", "Que los objetos puedan clonarse libremente", "Que la clase no pueda heredarse"], correctIndex: 1, category: "Patrones de Diseño", difficulty: "Medio" },
  { text: "¿Qué hace el patrón Observer?", options: ["Crea objetos sin especificar la clase exacta", "Garantiza una sola instancia de una clase", "Permite que un objeto notifique cambios a sus dependientes", "Adapta una interfaz incompatible a otra"], correctIndex: 2, category: "Patrones de Diseño", difficulty: "Medio" },
  { text: "¿Qué es el patrón Factory?", options: ["Garantiza una instancia única de una clase", "Crea objetos sin especificar la clase concreta exacta", "Organiza objetos en estructura de árbol", "Añade responsabilidades a objetos dinámicamente"], correctIndex: 1, category: "Patrones de Diseño", difficulty: "Medio" },
  { text: "¿En cuántas categorías se dividen los patrones de diseño GoF?", options: ["2", "3", "4", "5"], correctIndex: 1, category: "Patrones de Diseño", difficulty: "Difícil" },

  // ── Java ──────────────────────────────────────────────────────────────────
  { text: "¿Qué significa JVM en Java?", options: ["Java Variable Manager", "Java Virtual Memory", "Java Virtual Machine", "Java Version Module"], correctIndex: 2, category: "Java", difficulty: "Fácil" },
  { text: "¿Cuál es el tipo de dato correcto para almacenar un número decimal en Java?", options: ["int", "char", "boolean", "double"], correctIndex: 3, category: "Java", difficulty: "Fácil" },
  { text: "¿Qué hace la palabra clave 'final' en Java cuando se aplica a una variable?", options: ["La elimina al finalizar el método", "Permite que solo se lea una vez", "Impide que su valor sea modificado", "La convierte en pública"], correctIndex: 2, category: "Java", difficulty: "Medio" },
  { text: "¿Qué colección de Java NO permite elementos duplicados?", options: ["ArrayList", "LinkedList", "Vector", "HashSet"], correctIndex: 3, category: "Java", difficulty: "Medio" },
  { text: "¿Qué hace el Garbage Collector en Java?", options: ["Compila el código fuente", "Detecta errores de sintaxis", "Optimiza los bucles del programa", "Libera automáticamente la memoria de objetos sin referencias"], correctIndex: 3, category: "Java", difficulty: "Medio" },
  { text: "¿Qué es una expresión lambda en Java?", options: ["Un tipo de bucle especial", "Una forma concisa de implementar interfaces funcionales", "Un método que retorna void", "Un tipo de excepción"], correctIndex: 1, category: "Java", difficulty: "Medio" },
  { text: "¿Qué es un Stream en Java 8?", options: ["Un archivo de entrada/salida", "Un hilo de ejecución paralela", "Una secuencia de elementos para procesamiento funcional", "Un tipo de colección ordenada"], correctIndex: 2, category: "Java", difficulty: "Medio" },
  { text: "¿Qué significa la palabra clave 'static' en Java?", options: ["El elemento pertenece a una instancia específica", "El elemento no puede ser sobreescrito", "El elemento pertenece a la clase, no a instancias", "El elemento es inmutable"], correctIndex: 2, category: "Java", difficulty: "Medio" },
  { text: "¿Qué es Optional en Java 8?", options: ["Un modificador de acceso", "Un tipo de excepción opcional", "Un contenedor que puede o no contener un valor no nulo", "Una interfaz funcional"], correctIndex: 2, category: "Java", difficulty: "Difícil" },
  { text: "¿Cuál es la diferencia entre ArrayList y LinkedList en Java?", options: ["No hay diferencia", "ArrayList usa nodos enlazados; LinkedList usa arreglo dinámico", "ArrayList usa arreglo dinámico; LinkedList usa nodos enlazados", "ArrayList es inmutable; LinkedList es mutable"], correctIndex: 2, category: "Java", difficulty: "Difícil" },
  { text: "¿Qué interfaz debe implementar una clase para poder ordenarse con Collections.sort()?", options: ["Serializable", "Cloneable", "Iterable", "Comparable"], correctIndex: 3, category: "Java", difficulty: "Difícil" },
  { text: "¿Qué es una excepción checked en Java?", options: ["Una excepción que solo ocurre en tiempo de ejecución", "Una excepción que se debe declarar o manejar obligatoriamente", "Una excepción del sistema operativo", "Una excepción que no puede ser capturada"], correctIndex: 1, category: "Java", difficulty: "Difícil" },
  { text: "¿Qué hace la anotación @Override en Java?", options: ["Crea un nuevo método en la clase", "Indica que un método sobreescribe uno de la clase padre", "Declara un método como final", "Hace el método estático"], correctIndex: 1, category: "Java", difficulty: "Fácil" },
  { text: "¿Cuál es la clase base de todas las clases en Java?", options: ["Class", "Base", "Object", "Root"], correctIndex: 2, category: "Java", difficulty: "Medio" },
  { text: "¿Qué es un HashMap en Java?", options: ["Una lista ordenada de elementos", "Una estructura que asocia claves únicas con valores", "Un conjunto de elementos sin duplicados", "Un arreglo de tamaño fijo"], correctIndex: 1, category: "Java", difficulty: "Medio" },
  { text: "¿Cuál es la diferencia entre == y .equals() en Java con Strings?", options: ["Son idénticos", "== compara referencias; .equals() compara el contenido", ".equals() compara referencias; == compara el contenido", "Ninguno compara contenido"], correctIndex: 1, category: "Java", difficulty: "Medio" },
  { text: "¿Qué significa la palabra clave 'abstract' en Java aplicada a una clase?", options: ["La clase no puede tener métodos", "La clase puede instanciarse directamente", "La clase no puede instanciarse directamente", "La clase es pública automáticamente"], correctIndex: 2, category: "Java", difficulty: "Medio" },
  { text: "¿Qué es una interfaz en Java?", options: ["Una clase con todos sus métodos implementados", "Un contrato que define métodos sin implementación que las clases deben cumplir", "Un tipo de variable especial", "Una función que retorna objetos"], correctIndex: 1, category: "Java", difficulty: "Medio" },

  // ── Spring Boot ───────────────────────────────────────────────────────────
  { text: "¿Qué anotación marca el punto de entrada de una aplicación Spring Boot?", options: ["@SpringApplication", "@BootApplication", "@SpringBootApplication", "@MainApplication"], correctIndex: 2, category: "Spring Boot", difficulty: "Fácil" },
  { text: "¿Qué anotación se usa para inyección de dependencias en Spring?", options: ["@Inject", "@Autowired", "@Component", "@Bean"], correctIndex: 1, category: "Spring Boot", difficulty: "Fácil" },
  { text: "¿Qué anotación convierte una clase en controlador REST en Spring?", options: ["@Controller", "@RestController", "@RequestMapping", "@Service"], correctIndex: 1, category: "Spring Boot", difficulty: "Fácil" },
  { text: "¿Qué puerto usa Spring Boot por defecto?", options: ["3000", "8000", "8080", "9090"], correctIndex: 2, category: "Spring Boot", difficulty: "Fácil" },
  { text: "¿Qué anotación se usa para definir un endpoint GET en Spring?", options: ["@PostMapping", "@PutMapping", "@GetMapping", "@DeleteMapping"], correctIndex: 2, category: "Spring Boot", difficulty: "Fácil" },
  { text: "¿Qué es @Component en Spring?", options: ["Marca una clase como entidad de base de datos", "Marca una clase como bean gestionado por Spring", "Define un endpoint REST", "Configura la conexión a la base de datos"], correctIndex: 1, category: "Spring Boot", difficulty: "Medio" },
  { text: "¿Qué anotación marca una clase como entidad JPA en Spring?", options: ["@Component", "@Service", "@Entity", "@Repository"], correctIndex: 2, category: "Spring Boot", difficulty: "Medio" },
  { text: "¿Qué hace @PathVariable en Spring?", options: ["Inyecta una dependencia", "Extrae un valor de la URL de la petición", "Mapea el cuerpo de la petición HTTP", "Define el tipo de respuesta"], correctIndex: 1, category: "Spring Boot", difficulty: "Medio" },
  { text: "¿Qué archivo de configuración usa Spring Boot por defecto?", options: ["config.xml", "settings.json", "application.properties", "boot.config"], correctIndex: 2, category: "Spring Boot", difficulty: "Fácil" },
  { text: "¿Qué es Spring Data JPA?", options: ["Una base de datos propia de Spring", "Un servidor web embebido", "Una abstracción sobre JPA que simplifica el acceso a datos", "Un framework de testing"], correctIndex: 2, category: "Spring Boot", difficulty: "Medio" },
  { text: "¿Qué hace @RequestBody en Spring?", options: ["Envía datos al cliente", "Mapea el cuerpo de la petición HTTP a un objeto Java", "Define la URL del endpoint", "Valida los datos de entrada"], correctIndex: 1, category: "Spring Boot", difficulty: "Medio" },
  { text: "¿Qué anotación en Spring marca una clase como capa de servicio?", options: ["@Controller", "@Repository", "@Component", "@Service"], correctIndex: 3, category: "Spring Boot", difficulty: "Fácil" },
  { text: "¿Qué es la inyección de dependencias en Spring?", options: ["Crear objetos directamente con new()", "Un patrón donde Spring provee las dependencias automáticamente", "Copiar código entre clases", "Un tipo de herencia múltiple"], correctIndex: 1, category: "Spring Boot", difficulty: "Medio" },
  { text: "¿Qué anotación de Spring se usa para manejar excepciones globalmente?", options: ["@ExceptionHandler", "@ControllerAdvice", "@ErrorMapping", "@GlobalHandler"], correctIndex: 1, category: "Spring Boot", difficulty: "Difícil" },
  { text: "¿Qué es JPA en el contexto de Spring?", options: ["Un servidor de aplicaciones", "Java Persistence API — estándar para mapeo objeto-relacional", "Un gestor de dependencias", "Una herramienta de testing"], correctIndex: 1, category: "Spring Boot", difficulty: "Medio" },

  // ── Árboles Binarios (adicionales) ────────────────────────────────────────
  { text: "¿Qué propiedad define a un árbol binario de búsqueda (BST)?", options: ["Todos los nodos tienen exactamente dos hijos", "El hijo izquierdo es mayor que el padre", "El hijo izquierdo es menor que el padre y el derecho es mayor", "Todos los nodos están al mismo nivel"], correctIndex: 2, category: "Estructuras de Datos", difficulty: "Medio" },
  { text: "¿Qué recorrido de un BST produce los valores en orden ascendente?", options: ["Preorden", "Inorden", "Postorden", "Por niveles"], correctIndex: 1, category: "Estructuras de Datos", difficulty: "Medio" },
  { text: "¿Qué es un árbol Heap máximo (Max-Heap)?", options: ["El nodo raíz tiene el valor mínimo", "Cada padre es mayor o igual que sus hijos", "Todos los nodos tienen exactamente dos hijos", "Los nodos están ordenados de izquierda a derecha"], correctIndex: 1, category: "Estructuras de Datos", difficulty: "Medio" },
  { text: "¿Cuál es la complejidad de búsqueda en un BST perfectamente balanceado?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correctIndex: 2, category: "Estructuras de Datos", difficulty: "Medio" },
  { text: "¿Qué es un árbol binario completo?", options: ["Todos los nodos tienen exactamente 2 hijos", "Todos los niveles están llenos excepto posiblemente el último, llenándose de izquierda a derecha", "El árbol tiene exactamente n nodos", "Todos los nodos hoja están al mismo nivel"], correctIndex: 1, category: "Estructuras de Datos", difficulty: "Medio" },
  { text: "¿Cuál es la diferencia entre BFS y DFS al recorrer un árbol?", options: ["BFS recorre por niveles; DFS recorre en profundidad", "BFS recorre en profundidad; DFS recorre por niveles", "Ambos recorren de la misma forma", "BFS solo funciona en árboles binarios"], correctIndex: 0, category: "Estructuras de Datos", difficulty: "Medio" },
  { text: "¿Qué estructura de datos se usa comúnmente para implementar BFS?", options: ["Pila (Stack)", "Cola (Queue)", "Lista enlazada simple", "Árbol AVL"], correctIndex: 1, category: "Estructuras de Datos", difficulty: "Medio" },
  { text: "¿Qué algoritmo de ordenamiento está basado en la estructura Heap?", options: ["MergeSort", "QuickSort", "HeapSort", "BubbleSort"], correctIndex: 2, category: "Algoritmos", difficulty: "Medio" },
  { text: "¿Cuántos nodos máximos puede tener un árbol binario de 3 niveles (niveles 0, 1 y 2)?", options: ["5", "6", "7", "8"], correctIndex: 2, category: "Estructuras de Datos", difficulty: "Medio" },
  { text: "¿En qué caso un BST degenera en una lista enlazada?", options: ["Cuando se insertan elementos aleatorios", "Cuando el árbol está balanceado", "Cuando los elementos se insertan en orden ascendente o descendente", "Cuando el árbol tiene más de 100 nodos"], correctIndex: 2, category: "Estructuras de Datos", difficulty: "Difícil" },

  // ── El Salvador ───────────────────────────────────────────────────────────
  { text: "¿Cuál es la capital de El Salvador?", options: ["Santa Ana", "San Miguel", "Sonsonate", "San Salvador"], correctIndex: 3, category: "El Salvador", difficulty: "Fácil" },
  { text: "¿Cuántos departamentos tiene El Salvador?", options: ["12", "13", "14", "15"], correctIndex: 2, category: "El Salvador", difficulty: "Fácil" },
  { text: "¿Cuál es el plato típico nacional de El Salvador?", options: ["Tamales", "Nacatamales", "Pupusas", "Baleadas"], correctIndex: 2, category: "El Salvador", difficulty: "Fácil" },
  { text: "¿En qué fecha se celebra la independencia de El Salvador?", options: ["14 de septiembre", "15 de septiembre", "16 de septiembre", "28 de julio"], correctIndex: 1, category: "El Salvador", difficulty: "Fácil" },
  { text: "¿Cuál es la moneda oficial de El Salvador actualmente?", options: ["El colón salvadoreño", "El quetzal", "El lempira", "El dólar estadounidense"], correctIndex: 3, category: "El Salvador", difficulty: "Fácil" },
  { text: "¿Cuál es el volcán más alto de El Salvador?", options: ["Volcán Izalco", "Volcán San Miguel", "Volcán Santa Ana (Ilamatepec)", "Volcán San Salvador"], correctIndex: 2, category: "El Salvador", difficulty: "Medio" },
  { text: "¿Con qué apodo se conoce a El Salvador?", options: ["La Perla de Centroamérica", "La Tierra del Maíz", "El Pulgarcito de América", "El País de los Lagos"], correctIndex: 2, category: "El Salvador", difficulty: "Medio" },
  { text: "¿En qué año adoptó El Salvador el dólar como moneda oficial?", options: ["1999", "2000", "2001", "2003"], correctIndex: 2, category: "El Salvador", difficulty: "Medio" },
  { text: "¿Cuál es el lago más grande de El Salvador?", options: ["Lago de Coatepeque", "Lago de Ilopango", "Lago de Güija", "Lago Suchitlán"], correctIndex: 1, category: "El Salvador", difficulty: "Medio" },
  { text: "¿Qué es el Boquerón en El Salvador?", options: ["Un plato típico salvadoreño", "El cráter del volcán San Salvador", "Un parque nacional en Santa Ana", "Un río fronterizo con Honduras"], correctIndex: 1, category: "El Salvador", difficulty: "Medio" },
  { text: "¿Cuál es la segunda ciudad más grande de El Salvador?", options: ["Sonsonate", "San Miguel", "Santa Ana", "Usulután"], correctIndex: 2, category: "El Salvador", difficulty: "Medio" },
  { text: "¿Cuál es el río más largo de El Salvador?", options: ["Río Grande de San Miguel", "Río Paz", "Río Goascorán", "Río Lempa"], correctIndex: 3, category: "El Salvador", difficulty: "Medio" },
  { text: "¿En qué año se firmaron los Acuerdos de Paz en El Salvador?", options: ["1990", "1991", "1992", "1993"], correctIndex: 2, category: "El Salvador", difficulty: "Difícil" },
  { text: "¿Qué es la Ruta de las Flores en El Salvador?", options: ["Un parque de atracciones en San Salvador", "Una ruta turística por pueblos coloniales del occidente del país", "Un festival anual de música", "Un sendero ecológico en el volcán Santa Ana"], correctIndex: 1, category: "El Salvador", difficulty: "Medio" },
  { text: "¿Cuál es el idioma oficial de El Salvador?", options: ["Náhuatl", "Inglés", "Español", "Pipil"], correctIndex: 2, category: "El Salvador", difficulty: "Fácil" },
  { text: "¿Cuántos países conforman América Central?", options: ["5", "6", "7", "8"], correctIndex: 2, category: "El Salvador", difficulty: "Fácil" },

  // ── Geografía Mundial (adicionales) ───────────────────────────────────────
  { text: "¿Cuál es la capital de Australia?", options: ["Sídney", "Melbourne", "Brisbane", "Canberra"], correctIndex: 3, category: "Geografía", difficulty: "Medio" },
  { text: "¿Cuál es el país más grande del mundo por superficie?", options: ["China", "Canadá", "Estados Unidos", "Rusia"], correctIndex: 3, category: "Geografía", difficulty: "Fácil" },
  { text: "¿Cuál es la montaña más alta del mundo?", options: ["Monte K2", "Monte Kilimanjaro", "Monte Everest", "Monte Aconcagua"], correctIndex: 2, category: "Geografía", difficulty: "Fácil" },
  { text: "¿Cuál es la capital de Canadá?", options: ["Toronto", "Vancouver", "Montreal", "Ottawa"], correctIndex: 3, category: "Geografía", difficulty: "Medio" },
  { text: "¿Qué idioma tiene más hablantes nativos en el mundo?", options: ["Inglés", "Español", "Chino mandarín", "Hindi"], correctIndex: 2, category: "Geografía", difficulty: "Medio" },
  { text: "¿En qué país se encuentra Machu Picchu?", options: ["Chile", "Bolivia", "Perú", "Ecuador"], correctIndex: 2, category: "Geografía", difficulty: "Fácil" },
  { text: "¿Cuál es la capital de Nueva Zelanda?", options: ["Auckland", "Christchurch", "Hamilton", "Wellington"], correctIndex: 3, category: "Geografía", difficulty: "Medio" },
  { text: "¿En qué país se encuentra el río Amazonas en su mayor parte?", options: ["Colombia", "Venezuela", "Perú", "Brasil"], correctIndex: 3, category: "Geografía", difficulty: "Fácil" },
  { text: "¿Cuál es el desierto caliente más grande del mundo?", options: ["Desierto de Gobi", "Desierto de Arabia", "Desierto del Sahara", "Desierto de Atacama"], correctIndex: 2, category: "Geografía", difficulty: "Medio" },
  { text: "¿Cuál es la capital de Egipto?", options: ["Alejandría", "Luxor", "El Cairo", "Asuán"], correctIndex: 2, category: "Geografía", difficulty: "Fácil" },
  { text: "¿Cuál es el país de América Latina con más habitantes?", options: ["México", "Colombia", "Argentina", "Brasil"], correctIndex: 3, category: "Geografía", difficulty: "Fácil" },
  { text: "¿Cuántos países hay en el continente africano?", options: ["48", "52", "54", "58"], correctIndex: 2, category: "Geografía", difficulty: "Medio" },
  { text: "¿Cuál es la capital de Costa Rica?", options: ["Liberia", "Alajuela", "Heredia", "San José"], correctIndex: 3, category: "Geografía", difficulty: "Fácil" },
  { text: "¿Cuál es la capital de Argentina?", options: ["Córdoba", "Rosario", "Buenos Aires", "Mendoza"], correctIndex: 2, category: "Geografía", difficulty: "Fácil" },
  { text: "¿En qué país se encuentra la Sagrada Familia?", options: ["Italia", "Francia", "Portugal", "España"], correctIndex: 3, category: "Geografía", difficulty: "Fácil" },
  { text: "¿Cuál es el océano más pequeño del mundo?", options: ["Océano Índico", "Océano Atlántico", "Océano Ártico", "Océano Antártico"], correctIndex: 2, category: "Geografía", difficulty: "Medio" },
  { text: "¿En qué país se encuentran las Pirámides de Giza?", options: ["Irak", "Sudán", "Arabia Saudita", "Egipto"], correctIndex: 3, category: "Geografía", difficulty: "Fácil" },
  { text: "¿Cuál es la capital de Japón?", options: ["Osaka", "Kioto", "Hiroshima", "Tokio"], correctIndex: 3, category: "Geografía", difficulty: "Fácil" },

  // ── Patrones de Diseño (adicionales) ─────────────────────────────────────
  { text: "¿Qué hace el patrón Decorator?", options: ["Crea una copia exacta del objeto", "Garantiza una única instancia", "Añade responsabilidades a un objeto dinámicamente sin modificar su clase", "Define la interfaz de creación de objetos"], correctIndex: 2, category: "Patrones de Diseño", difficulty: "Medio" },
  { text: "¿Qué hace el patrón Strategy?", options: ["Garantiza una única instancia", "Crea objetos sin especificar su clase", "Define una familia de algoritmos intercambiables en tiempo de ejecución", "Notifica cambios a objetos dependientes"], correctIndex: 2, category: "Patrones de Diseño", difficulty: "Medio" },
  { text: "¿Qué hace el patrón Adapter?", options: ["Añade funcionalidad a un objeto dinámicamente", "Convierte la interfaz de una clase en otra que el cliente espera", "Define el esqueleto de un algoritmo", "Encapsula una solicitud como objeto"], correctIndex: 1, category: "Patrones de Diseño", difficulty: "Medio" },
  { text: "¿Qué hace el patrón Template Method?", options: ["Permite que subclases redefinan ciertos pasos de un algoritmo sin cambiar su estructura", "Garantiza una única instancia", "Crea objetos sin especificar la clase concreta", "Convierte interfaces incompatibles"], correctIndex: 0, category: "Patrones de Diseño", difficulty: "Medio" },
  { text: "¿Qué hace el patrón Command?", options: ["Observa cambios en un objeto", "Adapta una interfaz incompatible", "Encapsula una solicitud como objeto permitiendo parametrizar y deshacer operaciones", "Construye objetos complejos paso a paso"], correctIndex: 2, category: "Patrones de Diseño", difficulty: "Medio" },
  { text: "¿Qué hace el patrón Builder?", options: ["Garantiza una única instancia", "Construye objetos complejos paso a paso separando construcción de representación", "Notifica a múltiples objetos de un cambio", "Convierte interfaces incompatibles"], correctIndex: 1, category: "Patrones de Diseño", difficulty: "Medio" },
  { text: "¿Qué hace el patrón Proxy?", options: ["Crea múltiples copias de un objeto", "Proporciona un sustituto o representante de otro objeto para controlar el acceso", "Define una familia de algoritmos", "Encapsula solicitudes como objetos"], correctIndex: 1, category: "Patrones de Diseño", difficulty: "Medio" },
  { text: "¿Qué hace el patrón Facade?", options: ["Garantiza una única instancia", "Define familia de objetos relacionados", "Proporciona una interfaz simplificada a un subsistema complejo", "Observa cambios en el estado de objetos"], correctIndex: 2, category: "Patrones de Diseño", difficulty: "Fácil" },
  { text: "¿Qué hace el patrón Iterator?", options: ["Garantiza una única instancia", "Permite recorrer elementos de una colección sin exponer su representación interna", "Añade comportamiento a objetos dinámicamente", "Construye objetos complejos paso a paso"], correctIndex: 1, category: "Patrones de Diseño", difficulty: "Medio" },
  { text: "¿Cuál es la diferencia entre Abstract Factory y Factory Method?", options: ["No hay diferencia", "Abstract Factory crea un objeto; Factory Method crea familias", "Abstract Factory crea familias de objetos relacionados; Factory Method crea un tipo de objeto", "Abstract Factory usa herencia; Factory Method usa composición"], correctIndex: 2, category: "Patrones de Diseño", difficulty: "Difícil" },
  { text: "¿A qué categoría pertenece el patrón Singleton?", options: ["Estructural", "Creacional", "Comportamiento", "Arquitectural"], correctIndex: 1, category: "Patrones de Diseño", difficulty: "Fácil" },
  { text: "¿A qué categoría pertenece el patrón Observer?", options: ["Creacional", "Estructural", "Comportamiento", "Arquitectural"], correctIndex: 2, category: "Patrones de Diseño", difficulty: "Fácil" },
  { text: "¿A qué categoría pertenece el patrón Decorator?", options: ["Creacional", "Comportamiento", "Arquitectural", "Estructural"], correctIndex: 3, category: "Patrones de Diseño", difficulty: "Fácil" },
  { text: "¿Qué hace el patrón Chain of Responsibility?", options: ["Garantiza única instancia", "Crea familias de objetos", "Pasa una solicitud a lo largo de una cadena de manejadores hasta que uno la procesa", "Define algoritmos intercambiables"], correctIndex: 2, category: "Patrones de Diseño", difficulty: "Medio" },
  { text: "¿Qué hace el patrón State?", options: ["Garantiza única instancia", "Permite que un objeto altere su comportamiento cuando cambia su estado interno", "Construye objetos complejos paso a paso", "Observa y notifica cambios en objetos"], correctIndex: 1, category: "Patrones de Diseño", difficulty: "Medio" },
  { text: "¿Qué hace el patrón Composite?", options: ["Garantiza única instancia", "Añade responsabilidades dinámicamente", "Compone objetos en estructura de árbol para tratar individuales y compuestos uniformemente", "Convierte interfaces incompatibles"], correctIndex: 2, category: "Patrones de Diseño", difficulty: "Medio" },

  // ── Bases de Datos (adicionales) ──────────────────────────────────────────
  { text: "¿Qué es un índice en bases de datos?", options: ["Una copia de seguridad de la tabla", "Un tipo de relación entre tablas", "Una estructura que mejora la velocidad de búsqueda de datos", "Un tipo de clave foránea"], correctIndex: 2, category: "Bases de Datos", difficulty: "Fácil" },
  { text: "¿Qué hace la cláusula GROUP BY en SQL?", options: ["Ordena resultados ascendentemente", "Filtra registros antes de agrupar", "Agrupa filas que tienen los mismos valores en columnas especificadas", "Elimina registros duplicados"], correctIndex: 2, category: "Bases de Datos", difficulty: "Medio" },
  { text: "¿Para qué se usa HAVING en SQL?", options: ["Ordena los resultados de la consulta", "Filtra grupos después de aplicar GROUP BY", "Une dos tablas por una columna común", "Elimina duplicados del resultado"], correctIndex: 1, category: "Bases de Datos", difficulty: "Medio" },
  { text: "¿Cuál es la diferencia entre DELETE y TRUNCATE en SQL?", options: ["No hay diferencia", "DELETE borra toda la tabla; TRUNCATE borra fila por fila", "DELETE puede usar WHERE y registra en log; TRUNCATE elimina todo sin log", "TRUNCATE puede usar WHERE; DELETE no"], correctIndex: 2, category: "Bases de Datos", difficulty: "Medio" },
  { text: "¿Qué es una vista (VIEW) en SQL?", options: ["Una copia física de una tabla", "Un índice de búsqueda rápida", "Una tabla virtual basada en el resultado de una consulta SQL", "Un procedimiento almacenado"], correctIndex: 2, category: "Bases de Datos", difficulty: "Medio" },
  { text: "¿Qué significa DDL en SQL?", options: ["Data Delivery Language", "Database Definition Logic", "Data Definition Language", "Dynamic Data Layer"], correctIndex: 2, category: "Bases de Datos", difficulty: "Fácil" },
  { text: "¿Qué significa DML en SQL?", options: ["Data Management Layer", "Data Manipulation Language", "Database Module Logic", "Dynamic Mapping Language"], correctIndex: 1, category: "Bases de Datos", difficulty: "Fácil" },
  { text: "¿Qué es un stored procedure (procedimiento almacenado)?", options: ["Una vista de la base de datos", "Un índice de búsqueda optimizado", "Un tipo de relación entre tablas", "Un conjunto de instrucciones SQL precompiladas almacenadas en la base de datos"], correctIndex: 3, category: "Bases de Datos", difficulty: "Medio" },
  { text: "¿Qué establece la primera forma normal (1NF)?", options: ["Eliminar dependencias transitivas", "Asegurar que los atributos no clave dependan totalmente de la clave primaria", "Cada columna debe contener valores atómicos y no haber grupos repetidos de columnas", "Dividir tablas para evitar toda redundancia"], correctIndex: 2, category: "Bases de Datos", difficulty: "Difícil" },
  { text: "¿Qué tipo de JOIN devuelve solo los registros que coinciden en ambas tablas?", options: ["LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "INNER JOIN"], correctIndex: 3, category: "Bases de Datos", difficulty: "Fácil" },
  { text: "¿Qué devuelve un LEFT JOIN?", options: ["Solo registros que coinciden en ambas tablas", "Todos los registros de la tabla derecha", "Todos los registros de la tabla izquierda y los coincidentes de la derecha", "Todos los registros de ambas tablas"], correctIndex: 2, category: "Bases de Datos", difficulty: "Medio" },
  { text: "¿Qué es un trigger en bases de datos?", options: ["Un tipo de índice especial", "Una clave foránea compuesta", "Un procedimiento que se ejecuta automáticamente ante un evento en la tabla", "Un tipo de vista materializada"], correctIndex: 2, category: "Bases de Datos", difficulty: "Medio" },
  { text: "¿Qué hace DISTINCT en SQL?", options: ["Ordena los resultados de la consulta", "Elimina filas duplicadas del resultado de una consulta", "Agrupa registros similares por valor", "Filtra filas por una condición"], correctIndex: 1, category: "Bases de Datos", difficulty: "Fácil" },
  { text: "¿Qué es una transacción en bases de datos?", options: ["Una copia de seguridad automática", "Una secuencia de operaciones que se ejecuta como una unidad atómica: toda o ninguna", "Un tipo de índice especial para consultas frecuentes", "Una consulta compleja con múltiples JOINs"], correctIndex: 1, category: "Bases de Datos", difficulty: "Medio" },

  // ── Algoritmos (adicionales) ──────────────────────────────────────────────
  { text: "¿Para qué sirve el algoritmo de Dijkstra?", options: ["Ordenar arreglos en O(n log n)", "Encontrar el camino más corto desde un nodo origen en grafos con pesos no negativos", "Recorrer árboles en profundidad", "Detectar ciclos en un grafo"], correctIndex: 1, category: "Algoritmos", difficulty: "Medio" },
  { text: "¿Qué es la programación dinámica?", options: ["Programar usando múltiples hilos simultáneos", "Elegir siempre la opción localmente óptima", "Dividir el problema en subproblemas solapados y guardar sus resultados para evitar recálculos", "Ordenar datos antes de procesarlos"], correctIndex: 2, category: "Algoritmos", difficulty: "Difícil" },
  { text: "¿Qué caracteriza a un algoritmo Greedy?", options: ["Divide el problema en subproblemas iguales", "Elige siempre la opción localmente óptima esperando obtener un resultado global óptimo", "Usa memoria para guardar resultados de subproblemas", "Ordena los datos antes de buscar"], correctIndex: 1, category: "Algoritmos", difficulty: "Medio" },
  { text: "¿En qué consiste la técnica Divide y Vencerás?", options: ["Elegir la opción greedy en cada paso", "Guardar resultados de subproblemas en memoria", "Dividir el problema en subproblemas más pequeños, resolverlos recursivamente y combinar sus resultados", "Recorrer grafos por niveles usando una cola"], correctIndex: 2, category: "Algoritmos", difficulty: "Medio" },
  { text: "¿Qué hace el algoritmo DFS (búsqueda en profundidad)?", options: ["Recorre por niveles usando una cola", "Recorre el grafo profundizando en cada rama antes de retroceder", "Encuentra el camino más corto entre dos nodos", "Ordena nodos por su peso"], correctIndex: 1, category: "Algoritmos", difficulty: "Medio" },
  { text: "¿Cuál es la complejidad de HeapSort en todos los casos?", options: ["O(n²)", "O(n)", "O(n log n)", "O(log n)"], correctIndex: 2, category: "Algoritmos", difficulty: "Medio" },
  { text: "¿Qué problema resuelve el algoritmo de la mochila (Knapsack)?", options: ["Ordenar elementos de un arreglo", "Encontrar rutas mínimas en un grafo", "Maximizar el valor de objetos seleccionados sin superar una capacidad máxima", "Buscar un elemento en tiempo O(log n)"], correctIndex: 2, category: "Algoritmos", difficulty: "Difícil" },

  // ── POO (adicionales) ─────────────────────────────────────────────────────
  { text: "¿Qué es la sobreescritura (override) de métodos en POO?", options: ["Crear un método con el mismo nombre pero distintos parámetros", "Eliminar un método heredado de la clase padre", "Redefinir en una subclase un método heredado de la clase padre", "Crear múltiples constructores en una clase"], correctIndex: 2, category: "POO", difficulty: "Fácil" },
  { text: "¿Qué es la sobrecarga (overload) de métodos en POO?", options: ["Redefinir un método heredado en la subclase", "Definir varios métodos con el mismo nombre pero distintos parámetros o tipos", "Ocultar atributos de la clase padre", "Llamar al constructor de la clase padre"], correctIndex: 1, category: "POO", difficulty: "Fácil" },
  { text: "¿Cuál es la diferencia entre herencia y composición en POO?", options: ["No hay diferencia práctica", "Herencia usa interfaces; composición usa clases concretas", "Herencia significa que una clase 'es un' tipo de otra; composición que 'tiene un' objeto de otra", "La herencia siempre es más flexible que la composición"], correctIndex: 2, category: "POO", difficulty: "Medio" },
  { text: "¿Qué es un método estático en POO?", options: ["Un método que solo puede ser privado", "Un método que pertenece a la clase y no requiere instancia para ser llamado", "Un método que no puede retornar valores", "Un método que solo se puede heredar"], correctIndex: 1, category: "POO", difficulty: "Fácil" },
  { text: "¿Para qué se usa la palabra clave 'super' en POO?", options: ["Convertir el objeto en estático", "Ocultar el método actual de la subclase", "Hacer referencia a la clase padre y acceder a sus métodos o constructor", "Destruir la instancia actual del objeto"], correctIndex: 2, category: "POO", difficulty: "Medio" },
  { text: "¿Qué es una clase final (final class)?", options: ["Una clase con todos sus métodos privados", "Una clase que no puede ser instanciada directamente", "Una clase que no puede ser heredada por otras clases", "Una clase que solo puede tener un objeto en memoria"], correctIndex: 2, category: "POO", difficulty: "Medio" },
  { text: "¿Qué es la cohesión en POO?", options: ["Nivel de dependencia entre distintas clases", "Capacidad de reutilizar clases en otros proyectos", "Grado en que los elementos de una clase están relacionados y tienen una única responsabilidad bien definida", "Número de métodos públicos que expone una clase"], correctIndex: 2, category: "POO", difficulty: "Difícil" },
  { text: "¿Qué es el acoplamiento en POO?", options: ["Grado de relación interna entre elementos de una misma clase", "Grado de dependencia entre distintas clases o módulos", "Capacidad de una clase de heredar de múltiples padres", "Número de atributos que tiene una clase"], correctIndex: 1, category: "POO", difficulty: "Difícil" },

  // ── Programación (adicionales) ────────────────────────────────────────────
  { text: "¿Qué es una closure en programación?", options: ["Un tipo de bucle especial", "Una función anónima sin parámetros", "Una función que recuerda y accede a variables de su ámbito léxico exterior", "Un módulo de código encapsulado"], correctIndex: 2, category: "Programación", difficulty: "Medio" },
  { text: "¿Qué es una Promesa (Promise) en JavaScript?", options: ["Una función que se ejecuta inmediatamente", "Un tipo de variable especial para datos numéricos", "Un objeto que representa la finalización o falla de una operación asíncrona", "Una clase de manejo de errores"], correctIndex: 2, category: "Programación", difficulty: "Medio" },
  { text: "¿Qué permite async/await en JavaScript?", options: ["Ejecutar código en paralelo con múltiples hilos", "Bloquear el hilo principal mientras espera una respuesta", "Escribir código asíncrono basado en Promesas de forma más legible y síncrona", "Crear funciones que siempre retornan undefined"], correctIndex: 2, category: "Programación", difficulty: "Medio" },
  { text: "¿Qué es la inmutabilidad en programación?", options: ["Capacidad de cambiar el tipo de una variable en tiempo de ejecución", "Propiedad de datos que no pueden ser modificados después de su creación", "Técnica para optimizar bucles repetitivos", "Forma de declarar variables con alcance global"], correctIndex: 1, category: "Programación", difficulty: "Medio" },
  { text: "¿Qué caracteriza al paradigma de programación funcional?", options: ["Programar usando solo clases y objetos", "Programar orientado a eventos del usuario", "Tratar la computación como evaluación de funciones matemáticas evitando estado mutable", "Ejecutar instrucciones de forma secuencial con variables globales"], correctIndex: 2, category: "Programación", difficulty: "Medio" },
  { text: "¿Qué significa el principio DRY en programación?", options: ["Design Reusable Yields: diseñar para reutilización", "Don't Repeat Yourself: evitar la duplicación de lógica o código", "Dynamic Runtime Yield: optimizar en tiempo de ejecución", "Define Reusable Yield: definir funciones reutilizables"], correctIndex: 1, category: "Programación", difficulty: "Fácil" },

  // ── Spring Boot (adicionales) ─────────────────────────────────────────────
  { text: "¿Qué hace la anotación @Transactional en Spring?", options: ["Define un endpoint REST", "Marca una clase como repositorio de datos", "Gestiona automáticamente las transacciones de base de datos", "Inyecta dependencias en la clase"], correctIndex: 2, category: "Spring Boot", difficulty: "Medio" },
  { text: "¿Para qué se usa @Value en Spring Boot?", options: ["Para definir el valor de retorno de un método", "Para inyectar valores desde archivos de configuración como application.properties", "Para validar los datos de entrada de un endpoint", "Para marcar un campo como requerido en el formulario"], correctIndex: 1, category: "Spring Boot", difficulty: "Medio" },
  { text: "¿Qué es Spring Security?", options: ["Un framework para pruebas de rendimiento", "Un módulo que provee autenticación, autorización y otras funciones de seguridad para Spring", "Un gestor de dependencias alternativo a Maven", "Una base de datos embebida para pruebas"], correctIndex: 1, category: "Spring Boot", difficulty: "Medio" },
  { text: "¿Qué hace la anotación @SpringBootTest?", options: ["Inicia el servidor en modo producción", "Carga el contexto completo de la aplicación para pruebas de integración", "Ejecuta solo pruebas unitarias sin contexto", "Configura la base de datos de prueba automáticamente"], correctIndex: 1, category: "Spring Boot", difficulty: "Medio" },
  { text: "¿Qué hace @ResponseStatus en Spring?", options: ["Inyecta el código de respuesta HTTP en el cuerpo", "Define el código de estado HTTP que debe retornar un método o excepción", "Valida el formato de la respuesta JSON", "Redirige la respuesta a otra URL"], correctIndex: 1, category: "Spring Boot", difficulty: "Medio" },

  // ── Tecnología (adicionales) ──────────────────────────────────────────────
  { text: "¿Qué es la computación en la nube (Cloud Computing)?", options: ["Almacenar datos únicamente en dispositivos físicos locales", "Provisión de servicios informáticos (servidores, almacenamiento, software) a través de internet", "Un tipo de red de área local (LAN)", "Un sistema operativo distribuido para mainframes"], correctIndex: 1, category: "Tecnología", difficulty: "Fácil" },
  { text: "¿Qué es un contenedor en Docker?", options: ["Una máquina virtual de alto consumo de recursos", "Un entorno aislado y ligero que empaqueta una aplicación junto con sus dependencias", "Un lenguaje de programación para servidores", "Un gestor de bases de datos NoSQL"], correctIndex: 1, category: "Tecnología", difficulty: "Medio" },
  { text: "¿Qué significa CI/CD en desarrollo de software?", options: ["Computer Interface / Central Deployment", "Continuous Integration / Continuous Delivery o Deployment", "Code Inspection / Code Delivery", "Centralized Integration / Code Distribution"], correctIndex: 1, category: "Tecnología", difficulty: "Medio" },

  // ── Java (adicionales) ────────────────────────────────────────────────────
  { text: "¿Cuántos principios componen SOLID en POO?", options: ["3", "4", "5", "6"], correctIndex: 2, category: "Java", difficulty: "Fácil" },
  { text: "¿Qué hace la palabra clave 'synchronized' en Java?", options: ["Ordena los elementos de una colección", "Conecta dos hilos de ejecución entre sí", "Garantiza que solo un hilo a la vez ejecute un bloque de código", "Crea un nuevo hilo de ejecución"], correctIndex: 2, category: "Java", difficulty: "Difícil" },
  { text: "¿Qué es el try-with-resources en Java?", options: ["Un tipo de excepción especializada", "Una forma de manejar múltiples excepciones a la vez", "Un bloque que cierra automáticamente recursos como archivos o conexiones al terminar", "Una alternativa a los bloques catch"], correctIndex: 2, category: "Java", difficulty: "Medio" },
];

export type GameCategory = 'mixta' | 'programacion';

const PROGRAMMING_CATEGORIES = [
  'Programación', 'Tecnología', 'POO',
  'Estructuras de Datos', 'Algoritmos', 'Bases de Datos', 'Patrones de Diseño',
  'Java', 'Spring Boot',
];

export function getCategoryQuestions(category: GameCategory = 'mixta', count = 15): Question[] {
  const pool = category === 'programacion'
    ? QUESTION_BANK.filter(q => PROGRAMMING_CATEGORIES.includes(q.category))
    : QUESTION_BANK;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}

export function getRandomQuestions(count: number = 5): Question[] {
  return getCategoryQuestions('mixta', count);
}
