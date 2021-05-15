require('colors');

const { 
    inquirerMenu,
    pausa,
    leerInput,
    listadoBorrar,
    confirmar,
    mostrarListadoCheckList
} = require('./helpers/inquirer');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const Tareas = require('./models/tareas');

const main = async() => {

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB()

    if (tareasDB) {  //cargar tareas
        tareas.cargarTareasFromArray(tareasDB)
    }

    do {
       // imprimir menu
       opt = await inquirerMenu();

       switch (opt) {
           case '1':
               const desc = await leerInput('Descripcion:')
               tareas.crearTarea(desc)
               break;
            case '2':
                tareas.listadoCompleto()
                break;
            case '3':
                tareas.listarPendientesCompletadas()
                break;
            case '4':
                tareas.listarPendientesCompletadas(false)
                break;
            case '5':
                const ids = await mostrarListadoCheckList(tareas.listadoArr)
                tareas.toggleCompletadas(ids)
                console.log(ids)
                // Crear opcion
                break;
            case '6':  //BORRAR
                const id = await listadoBorrar(tareas.listadoArr)
                if (id !== '0') {
                    //TODO: Preguntar si esta seguro
                    const ok = await confirmar('¿Estas seguro?')
                    if (ok) {
                        tareas.borrarTarea(id)
                        console.log('Tarea Borrada')
                    }
                }
                // Crear opcion
                break;
                
       }
       guardarDB(tareas.listadoArr)

       await pausa();
    } while (opt !== '0');
    
}

main()