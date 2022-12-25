<script lang="ts">
    import { Dialog, DialogTitle } from '@rgossiaux/svelte-headlessui'
    import { ExclamationTriangle } from 'svelte-heros-v2'

    export let title: string
    export let message: string
    export let isOpen: boolean
</script>

<div>
    <Dialog
        open={isOpen}
        on:close={() => {
            isOpen = false
        }}
        class="relative z-50 text-black dark:text-white"
    >
        <div class="fixed inset-0 bg-black bg-opacity-50" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
            <div
                class="w-full max-w-md transform overflow-hidden rounded-2xl dark:bg-zinc-900 bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
                <div class="flex items-start">
                    <div
                        class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                    >
                        <ExclamationTriangle class="w-8 h-8 text-red-500" />
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <DialogTitle
                            as="h3"
                            class="text-2xl font-medium leading-6"
                        >
                            {title}
                        </DialogTitle>

                        <div class="mt-2">
                            <p class="text-lg">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex flex-row-reverse">
                    <button
                        class="bg-primary text-white py-2 px-4 rounded-lg"
                        on:click={() => (isOpen = false)}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    </Dialog>
</div>
