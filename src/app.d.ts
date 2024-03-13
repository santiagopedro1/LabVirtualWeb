// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type SensorData = {
		timestamp: Date;
		data: {
			[sensorId: string]: {
				[key: string]: number;
			};
		};
	};

	type SensorInfo = {
		internalId: string;
		sensorName: string;
		supportedAtr: string[];
		desc: string | null;
	};
}

export {};
