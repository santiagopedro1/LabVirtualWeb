// TODO: Fazer isso aqui funcionar

async function getData(){

   const response = await fetch('DADOS.csv');
   const data = await response.text();
   const tempo = []
   const A_Umidade = []
   const A_Conductividade = []
   const A_Temperatura = []
   const B_Umidade = []
   const B_Conductividade = []
   const B_Temperatura = []
   const linhas = data.split('\n').slice(1)
   linhas.forEach(linhas => {
       const colunas = linhas.split(';')
       tempo.push(colunas[0])
       A_Umidade.push(colunas[1])
       A_Conductividade.push(colunas[2])
       A_Temperatura.push(colunas[3])
       B_Umidade.push(colunas[4])
       B_Conductividade.push(colunas[5])
       B_Temperatura.push(colunas[6])
   })
   return{tempo, A_Umidade, A_Conductividade,A_Temperatura, B_Umidade, B_Conductividade, B_Temperatura}
}