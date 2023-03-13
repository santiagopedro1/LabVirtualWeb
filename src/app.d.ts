// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface Platform {}
    }

    interface LeituraDB {
        id_sensor_de_usuario: number
        data_hora: Date
        leitura: {
            [key: string]: number
        }
    }

    interface Leitura {
        [key: string]: { data_hora: string; [key: string]: any }[]
    }
}

export {}
