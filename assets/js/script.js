const form = document.getElementById('calculadora'); 
const chart = document.getElementById('myChart'); 
let myChart;
const api = 'https://mindicador.cl/api/';

const obtenerDatosDivisas = async (moneda) => {
try{
    const valores = await fetch(`${api}${moneda}`)
    if(!valores.ok){
        throw new Error(`HTTP error! status: ${valores.status}`);
    }
    const resultados = await valores.json()
    console.log(resultados)
    return resultados.serie
}catch(error){
    alert('Ha ocurrido un error')
}
};

obtenerDatosDivisas('euro')

const calcularTotalDivisa = (valor, datos) => {
    const valorMoneda = datos[0].valor
    const total = valor / valorMoneda
    return Math.round(total * 100) / 100
};

const renderizarTotal = (total) => {
    document.getElementById('total-valor').innerHTML = total
};

const obtenerFechas = (datos) => {
    const fechasFormateadas = datos.map((item) => new Date(item.fecha).toLocaleDateString('en-US'))
    const fechasOrdenas = fechasFormateadas.sort((a, b) => new Date(a) - new Date(b))
    const primeras10Fechas = fechasFormateadas.slice(0, 10)
    console.log(primeras10Fechas)
    return primeras10Fechas
};

const obtenerValores = (datos) => {
    return datos.map((item) => item.valor)
};

const destruirGrafico = () => {
    if(myChart){
        myChart.destroy()
    }
};

const renderizarGrafico = (datos, valor) => { 
    const total = calcularTotalDivisa(valor, datos)
    renderizarTotal(total)

    const labels = obtenerFechas(datos)
    const values = obtenerValores(datos)

    const datasets =[
        {
        label: 'Divisa',
        borderColor: 'rgba(135, 255, 99, 0.644)',
        data: values,
        backgroundColor: 'white',
        borderRadius : '5px'
        }
    ]

    const config = {
        type: 'line',
        data: {labels, datasets}
    }

    destruirGrafico()

    myChart = new Chart(chart, config)
}

const calcularValorDivisa = async (valor, moneda) => { 
    const datos = await obtenerDatosDivisas(moneda)
    renderizarGrafico(datos, valor)
};

form.addEventListener('submit', async (event) => { 
    event.preventDefault()

    const valor = form.elements['valor'].value 
    const moneda = form.elements['moneda'].value

   calcularValorDivisa(valor, moneda)
   
})


