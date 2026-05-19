export type Scenario = {
	id: string;
	label: string;
	prospect_text: string;
};

export const CANNED_SCENARIOS: Scenario[] = [
	{
		id: "water-heater",
		label: "Water heater leak",
		prospect_text:
			"Hi I just called you - my water heater is leaking everywhere can someone come today",
	},
	{
		id: "ac-tune-up",
		label: "AC tune-up",
		prospect_text:
			"Hey, looking to schedule an AC tune-up sometime next month if possible",
	},
	{
		id: "parts-inquiry",
		label: "Parts inquiry",
		prospect_text:
			"Do you guys sell parts? Just need a replacement thermostat, not install",
	},
	{
		id: "obvious-spam",
		label: "Obvious spam",
		prospect_text: "Congratulations! You won $5000 click here bit.ly/abc",
	},
];
