<script lang="ts">
    import { SlideToggle } from '@skeletonlabs/skeleton'

    export let sensores: SensorData[]
    export let fn: (id: number, data: string) => void

    interface SensorData {
        id: number
        dataRead: string[]
        name: string
        description: string
    }
</script>

<div class="flex justify-around">
    {#each sensores as sensor}
        <div class="flex flex-col items-center">
            <span
                title="Tipo: {sensor.name}"
                class="text-xl capitalize font-bold">Sensor {sensor.id}</span
            >
            <div class="flex flex-col gap-3 items-center">
                <span class="text-xs">({sensor.description})</span>
                {#each sensor.dataRead as data}
                    <div class="flex space-x-4">
                        <p>{data}</p>
                        <SlideToggle
                            name="slider-label"
                            active="bg-secondary-500"
                            size="sm"
                            checked
                            on:change={() => fn(sensor.id, data)}
                        />
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>
