import { useNavigate, Form, useActionData, redirect } from "react-router-dom"
import Formulario from "../components/Formulario"
import Error from '../components/Error'
import { agregarCliente } from '../data/clientes'
export async function action({request}) {

  //diferentes formas para acceder a la información, se ha substituido ajax por fromData
  const formData = await request.formData() 
  // console.log(formData.get('nombre'))
  // console.log({...formData})

  const datos = Object.fromEntries(formData)
  const email = formData.get('email')

  //Validación
  const errores = []
  if(Object.values(datos).includes('')){
      errores.push('Todos los campos son obligatorios')
  }

   //Se encarga de comprovar si email cumple con el formato de regex, si no cumple la condicion envia el emailno es valido
  let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
  if(!regex.test(email)){
    errores.push('El email no es valido')
  }

  //Retomar datos si hay errores
  if(Object.keys(errores).length){
    console.log('Si hay errores')
  }

  await agregarCliente(datos)

  return redirect('/')
}


function NuevoCliente() {

  const errores = useActionData()
  const navigate = useNavigate()


  return (
    <>
      <h1 className="font-black text-4xl text-blue-900"> Nuevo Cliente</h1>
      <p className="mt-3"> Llena todos los campos para registrar un nuevo cliente</p>

      <div className='flex justify-end'>
        <button
          className='bg-blue-800 text-white font-bold uppercase'
          //-1 en navigate vuelve a la vista anterior
          onClick={() => navigate(-1)}>
            Volver
          </button>
      </div>

      <div className="bg-white shadow rounded-md md:w3/4 mx-auto px-5 py-10 mt-20">

        {/* //si hay errores  */}
        {errores?.length && errores.map(( error, i) => <Error key={i}>{error}</Error>)}

        <Form
          method='post'
          noValidate
        >
          
          <Formulario />

          <input
            type="submit"
            className="mt-5 w-full bg-blue-800 p-3 uppercase font-bold text-white text-lg"
            value="Registrar cliente"
            />             
        </Form>
      </div>
    </>
  )
}

export default NuevoCliente