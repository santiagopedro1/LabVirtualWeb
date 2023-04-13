<script lang="ts">
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
                    <div class="flex">
                        <span class="font-medium mr-3">{data}</span>
                        <label
                            class="relative inline-flex items-center cursor-pointer"
                            id="{sensor.id}_{data}"
                        >
                            <input
                                type="checkbox"
                                value=""
                                class="sr-only peer"
                                checked
                                on:click={() => {
                                    fn(sensor.id, data)
                                }}
                            />
                            <div
                                class="w-11 h-6 relative bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-secondary"
                            />
                        </label>
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>
