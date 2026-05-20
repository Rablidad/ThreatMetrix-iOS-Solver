const crypto = require("crypto");
const randomHash = require("./randomHash");

module.exports = () => {
  const _128GB = 127968497664;
  const _256GB = 255968497664;
  const _512GB = 511968497664;

  const harddisk = [
    {
      name: "512",
      size: _512GB,
      nodes: (_512GB * Math.random() * (0.87 - 0.81) + 0.81) / 100,
    },
    {
      name: "256",
      size: _256GB,
      nodes: (_256GB * Math.random() * (0.95 - 0.91) + 0.91) / 100,
    },
    {
      name: "128",
      size: _128GB,
      nodes: (_128GB * Math.random() * (0.85 - 0.81) + 0.81) / 100,
    },
  ];

  const iosVersions = [
    { version: "16.0", build: "20A362" },
    { version: "16.0.1", build: "20A371" },
    { version: "16.0.2", build: "20A380" },
    { version: "16.0.3", build: "20A392" },
    { version: "16.1", build: "20B82" },
    { version: "16.1.1", build: "20B101" },
    { version: "16.1.2", build: "20B110" },
    { version: "16.2", build: "20C65" },
    { version: "16.3", build: "20D47" },
    { version: "16.3.1", build: "20D67" },
    { version: "16.4", build: "20E247" },
    { version: "16.4.1", build: "20E252" },
    { version: "16.5", build: "20F66" },
    { version: "16.5.1", build: "20F75" },
    { version: "16.6", build: "20G75" },
    { version: "16.6.1", build: "20G81" },
    { version: "16.7", build: "20H19" },
    { version: "16.7.1", build: "20H30" },
    { version: "16.7.2", build: "20H115" },
    { version: "16.7.3", build: "20H232" },
    { version: "17.0", build: "21A327" },
    { version: "17.0.1", build: "21A340" },
    { version: "17.0.2", build: "21A350" },
    { version: "17.0.3", build: "21A360" },
    { version: "17.1", build: "21B80" },
    { version: "17.1.1", build: "21B91" },
    { version: "17.1.2", build: "21B101" },
    { version: "17.2", build: "21C62" },
  ];
  const models = [
    {
      name: "iPhone XR",
      code: "iPhone11,8",
      resolution: "1792x828",
      viewport: { width: 414, height: 896, ratio: 2.0 },
      model: "N841AP",
      cpu: "A12",
    },
    {
      name: "iPhone XS",
      code: "iPhone11,2",
      resolution: "2436x1125",
      viewport: { width: 375, height: 812, ratio: 3.0 },
      model: "D321AP",
      cpu: "A12",
    },
    {
      name: "iPhone XS Max",
      code: "iPhone11,6",
      resolution: "2688x1242",
      viewport: { width: 414, height: 896, ratio: 3.0 },
      model: "D331pAP",
      cpu: "A12",
    },
    {
      name: "iPhone 11",
      code: "iPhone12,1",
      resolution: "1792x828",
      viewport: { width: 414, height: 896, ratio: 2.0 },
      model: "N104AP",
      cpu: "A13",
    },
    {
      name: "iPhone 11 Pro",
      code: "iPhone12,3",
      resolution: "2436x1125",
      viewport: { width: 375, height: 812, ratio: 3.0 },
      model: "D421AP",
      cpu: "A13",
    },
    {
      name: "iPhone 11 Pro Max",
      code: "iPhone12,5",
      resolution: "2688x1242",
      viewport: { width: 414, height: 896, ratio: 3.0 },
      model: "D431AP",
      cpu: "A13",
    },
    {
      name: "iPhone 12 Mini",
      code: "iPhone13,1",
      resolution: "2340x1080",
      viewport: { width: 360, height: 780, ratio: 3.0 },
      model: "D52gAP",
      cpu: "A14",
    },
    {
      name: "iPhone 12",
      code: "iPhone13,2",
      resolution: "2532x1170",
      viewport: { width: 390, height: 844, ratio: 3.0 },
      model: "D53gAP",
      cpu: "A14",
    },
    {
      name: "iPhone 12 Pro",
      code: "iPhone13,3",
      resolution: "2532x1170",
      viewport: { width: 390, height: 844, ratio: 3.0 },
      model: "D53AP",
      cpu: "A14",
    },
    {
      name: "iPhone 12 Pro Max",
      code: "iPhone13,4",
      resolution: "2778x1284",
      viewport: { width: 428, height: 926, ratio: 3.0 },
      model: "D54pAP",
      cpu: "A14",
    },
    {
      name: "iPhone 13 Mini",
      code: "iPhone14,4",
      resolution: "2340x1080",
      viewport: { width: 360, height: 780, ratio: 3.0 },
      model: "D16AP",
      cpu: "A15",
    },
    {
      name: "iPhone 13",
      code: "iPhone14,5",
      resolution: "2532x1170",
      viewport: { width: 390, height: 844 },
      model: "D16AP",
      cpu: "A15",
    },
    {
      name: "iPhone 13 Pro",
      code: "iPhone14,2",
      resolution: "2532x1170",
      viewport: { width: 390, height: 844, ratio: 3.0 },
      model: "D63AP",
      cpu: "A15",
    },
    {
      name: "iPhone 13 Pro Max",
      code: "iPhone14,3",
      resolution: "2778x1284",
      viewport: { width: 428, height: 926, ratio: 3.0 },
      model: "D64AP",
      cpu: "A15",
    },
    {
      name: "iPhone 14",
      code: "iPhone14,7",
      resolution: "2532x1170",
      viewport: { width: 390, height: 844, ratio: 3.0 },
      model: "D27AP",
      cpu: "A15",
    },
    {
      name: "iPhone 14 Plus",
      code: "iPhone14,8",
      resolution: "2778x1284",
      viewport: { width: 428, height: 926, ratio: 3.0 },
      model: "D28AP",
      cpu: "A15",
    },
    {
      name: "iPhone 14 Pro",
      code: "iPhone15,2",
      resolution: "2556x1179",
      viewport: { width: 393, height: 852, ratio: 3.0 },
      model: "D73AP",
      cpu: "A16",
    },
    {
      name: "iPhone 14 Pro Max",
      code: "iPhone15,3",
      resolution: "2796x1290",
      viewport: { width: 430, height: 932, ratio: 3.0 },
      model: "D74AP",
      cpu: "A16",
    },
  ];
  const operators = [
    { icc: "br", mnc: "00", mcc: "724", brand: "Nextel" },
    { icc: "br", mnc: "02", mcc: "724", brand: "TIM" },
    { icc: "br", mnc: "03", mcc: "724", brand: "TIM" },
    { icc: "br", mnc: "04", mcc: "724", brand: "TIM" },
    { icc: "br", mnc: "05", mcc: "724", brand: "Claro Brasil" },
    { icc: "br", mnc: "06", mcc: "724", brand: "VIVO" },
    { icc: "br", mnc: "10", mcc: "724", brand: "VIVO" },
    { icc: "br", mnc: "11", mcc: "724", brand: "VIVO" },
    { icc: "br", mnc: "15", mcc: "724", brand: "Sercomtel" },
    { icc: "br", mnc: "17", mcc: "724", brand: "Correios" },
    { icc: "br", mnc: "18", mcc: "724", brand: "datora" },
    { icc: "br", mnc: "23", mcc: "724", brand: "VIVO" },
    { icc: "br", mnc: "30", mcc: "724", brand: "VIVO" },
    { icc: "br", mnc: "31", mcc: "724", brand: "VIVO" },
    { icc: "br", mnc: "32", mcc: "724", brand: "Algar Telecom" },
    { icc: "br", mnc: "33", mcc: "724", brand: "Algar Telecom" },
    { icc: "br", mnc: "34", mcc: "724", brand: "Algar Telecom" },
    { icc: "br", mnc: "38", mcc: "724", brand: "Claro Brasil" },
    { icc: "br", mnc: "39", mcc: "724", brand: "Nextel" },
    { icc: "br", mnc: "54", mcc: "724", brand: "Conecta" },
  ];

  const randomHarddisk = harddisk[Math.floor(Math.random() * harddisk.length)];
  const randomOperator =
    operators[Math.floor(Math.random() * operators.length)];
  const randomModel = models[Math.floor(Math.random() * models.length)];
  const randomIOSVersion =
    iosVersions[Math.floor(Math.random() * iosVersions.length)];
  const idfv = crypto.randomUUID().toUpperCase();

  return {
    app: {
      idfv: idfv,
      idDispositivo: crypto
        .createHash("md5")
        .update(idfv)
        .digest("hex")
        .toUpperCase(),
      apelido: "Seu Dispositivo " + randomHash(8, true),
      headers: {
        // 'User-Agent': `Apple; ${randomModel.code}; iOS; ${randomIOSVersion.version}; ${randomIOSVersion.build}; mov-iphone-app; 9.4.1.0; pt_BR; ${randomOperator.brand}; 00; 4G; isSmartphone=true;`,
        "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS ${randomIOSVersion.version.replaceAll(
          ".",
          "_"
        )} like Mac OS X) AppleWebKit/615.7.1 (KHTML, like Gecko) Mobile/${
          randomIOSVersion.build
        }`,
        "Device-Info": `{"informacoesDeHardware":{"isSmartphone":"true"},"propriedadesUserAgent":{"OPERADORA":"${randomOperator.brand}","MARCA":"Apple","ACESSIBILIDADE":"false","TIPO_CONEXAO":"4G","TEMA_APLICATIVO":"branco","VERSAO_DO_APLICATIVO":"9.4.1.0","BUILD_DO_SISTEMA_OPERACIONAL":"${randomIOSVersion.build}","VERSAO_DO_SISTEMA_OPERACIONAL":"${randomIOSVersion.version}","MOBILE40":"true","SISTEMA_OPERACIONAL":"iOS","APLICATIVO":"mov-iphone-app","CODIGO_AREA":"00","MODELO":"${randomModel.name}","LOCALE":"pt_BR"}}`,
      },
    },
    web: {
      headers: {
        "User-Agent": `Mozilla/5.0 (Linux; Android 9; ASUS_AI2205_A Build/PQ3A.190605.07291528; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36 7.3-50`,
      },
    },
    iphone: {
      harddisk: randomHarddisk,
      operator: randomOperator,
      model: randomModel,
      ios: randomIOSVersion,
    },
  };
};
