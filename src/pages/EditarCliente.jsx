import {Form, useNavigate, useLoaderData, useActionData, redirect } from 'react-router-dom'
import { obtenerCliente, actualizarCliente } from "../data/clientes"
import Formulario from "../components/Formulario"
import Error from '../components/Error'

export async function loader({params}){
  const cliente =  await obtenerCliente(params.clenteId)
  if(Object.values(cliente).length === 0){
    throw new Response('',{
        status: 404,
        statusText: 'No hay resultados'
    })
  }
  return cliente
}

export async function action({request, params}) {
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

    //Actualizar el cliente
    await actualizarCliente(params.clienteId, datos)

    return redirect('/')
}

function EditarCliente() {

    const navigate = useNavigate()
    const cliente = useLoaderData()
    const errores = useActionData()
    return (
      <>
      <h1 className="font-black text-4xl text-blue-900"> Editar Cliente</h1>
      <p className="mt-3"> Modificación de cliente</p>

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

          <Formulario 
            cliente={cliente}
          />

          <input
            type="submit"
            className="mt-5 w-full bg-blue-800 p-3 uppercase font-bold text-white text-lg"
            value="Guardar Cambios"
            />             
        </Form>
      </div>
    </>
    )
}

export default EditarCliente