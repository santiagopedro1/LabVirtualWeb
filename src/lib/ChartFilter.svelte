<script lang="ts">
    import { SlideToggle } from '@skeletonlabs/skeleton'

    type Sensor = {
        nome: string
        descricao: string
        dados_lidos: string
    }

    export let sensores: Sensor[]
    export let fn: (id: number, data: string) => void
</script>

<div class="flex justify-around">
    {#each sensores as sensor, index}
        <div class="flex flex-col items-center">
            <span
                title="Tipo: {sensor.nome}"
                class="text-xl capitalize font-bold">Sensor {index + 1}</span
            >
            <div class="flex flex-col gap-3 items-center">
                <span class="text-xs">({sensor.descricao})</span>
                {#each sensor.dados_lidos as dados}
                    <div class="flex space-x-4">
                        <p>{dados}</p>
                        <SlideToggle
                            name="slider-label"
                            active="bg-secondary-500"
                            size="sm"
                            checked
                            on:change={() => fn(index + 1, dados)}
                        />
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>
