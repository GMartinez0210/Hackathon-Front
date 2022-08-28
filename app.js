require("dotenv").config()
const express = require("express")
const axios = require("axios")
const cors = require("cors")
const ejs = require("ejs")

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(cors())

app.get("/", async function(req, res) {
    const sliderInfo = [
        {
            littleP: "Depósito a plazo",
            title1P: "Obtén en",
            title2P: "tu Tarjeta Smart y recibe hasta",
            titleEm: "2 minutos",
            titleEm2: "s/ 200",
            p: "¡Promoción por tiempo limitado!",
            span: "Obtenla aquí",
            img: "https://www.bbva.pe/content/dam/public-web/peru/photos/marquees/COMPLEX-TC-HOME-AGOSTO-CASHBACK-100X1000.im1660692652306im.jpg?imwidth=960"
        },
        {
            littleP: "Depósito a plazo",
            title1P: "Abre tu Depósito a Plazo y haz",
            titleEm: "crecer tus ahorros",
            p: "Aprovecha esta super tasa de 7.8% en tu Depósito a Plazo",
            span: "Ábrelo aquí",
            img: "https://www.bbva.pe/content/dam/public-web/peru/photos/marquees/COMPLEX-PLAZO-FIJO-AGOSTO-1000X1000.im1661195283180im.jpg?imwidth=960"
        },
        {
            littleP: "Cuenta de ahorros",
            title1P: "¡Abre",
            title2P: "tu cuenta y gana",
            titleEm: "hoy",
            titleEm2: "s/ 5 000 diarios!",
            p: "¡Hazlo online en 1 minuto y multiplica x5 tus opciones de ganar!",
            span: "Ábrela aquí",
            img: "https://www.bbva.pe/content/dam/public-web/peru/photos/marquees/COMPLEX-HOME-CUENTAS-JUNIO-1000X1000.im1658961283543im.jpg?imwidth=960"
        },
        {
            littleP: "Préstamo de libre disponibilidad",
            title1P: "¡Tenemos un Préstamo Online para ti! Sorteamos",
            titleEm: "2 paquetes dobles a Punta Cana",
            p: "Obtén tu préstamo en solo 3 minutos y sin papeleos",
            span: "Obetenlo aquí",
            img: "https://www.bbva.pe/content/dam/public-web/peru/photos/marquees/PLD-AGOSTO-COMPLEX-1000X1000.im1660664177020im.jpg?imwidth=960"
        }
    ]

    res.render("home", {sliderInfo})
})

app.get("/aforo", async function(req, res) {
    const latitud = "-12.092391975686"
    const longitud = "-77.02414767080"
    const url = process.env.API_URL+"/local?"+`longitud=${longitud}&latitud=${latitud}`
    const mapaInfoAPI = await axios.post(url)
        .then(response => response.data)
        .catch(() => [])

    const {columns: mapInfoColumns, data: mapInfoData} = mapaInfoAPI
    
    const mapInfo = []

    mapInfoData.forEach(infoData => {
        let mapInfoAux = {}
        infoData.forEach((info, index) => {
            const key = mapInfoColumns[index]
            mapInfoAux[key] = info
        })
        mapInfo.push(mapInfoAux)
    })

    const servicioInfo = [
        {
            img: "./images/TC.webp",
            h2: "Obten una Tarjeta de Credito"
        },
        {
            img: "./images/Prestamo.webp",
            h2: "Necesito un préstamo"
        },
        {
            img: "./images/Abre-Cuenta.webp",
            h2: "Necesito una Cuenta de Ahorros"
        },
        {
            img: "./images/T-Cambio.png",
            h2: "Quiero cambiar dólares"
        },
        {
            img: "./images/Seguro_vehicular.webp",
            h2: "Ncesito seguro vehícular"
        },
        {
            img: "./images/Adelanto_sueldo.webp",
            h2: "Busco un adelanto de sueldo"
        }
    ]

    res.render("aforo", {servicioInfo, mapInfo})
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server running on ${port}`)
})