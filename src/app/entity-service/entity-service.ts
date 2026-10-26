import { inject, Service } from '@angular/core';

import { ThreejsService } from '../threejs-service';

interface Entity {
	id: string;
	name: string;
	description: string;
	type: 'PlanterPot' | 'Plant';
}

@Service({
	autoProvided: false,
})
export class EntityService {
	private threejsService = inject(ThreejsService);

	private entities: Entity[] = [
		{
			id: 'e1',
			name: 'Terracotta Pot L',
			description: 'Large classic terracotta pot, 30 cm diameter',
			type: 'PlanterPot',
		},
		{
			id: 'e2',
			name: 'Monstera Deliciosa',
			description: 'Swiss cheese plant, loves indirect light',
			type: 'Plant',
		},
		{
			id: 'e3',
			name: 'Ceramic Pot S',
			description: 'Small white ceramic pot, 12 cm diameter',
			type: 'PlanterPot',
		},
		{
			id: 'e4',
			name: 'Ficus Lyrata',
			description: 'Fiddle leaf fig, needs bright light',
			type: 'Plant',
		},
		{
			id: 'e5',
			name: 'Hanging Rattan Basket',
			description: 'Woven hanging basket with coconut liner',
			type: 'PlanterPot',
		},
		{
			id: 'e6',
			name: 'Snake Plant',
			description: 'Sansevieria trifasciata, very low maintenance',
			type: 'Plant',
		},
		{
			id: 'e7',
			name: 'Self-Watering Planter',
			description: 'Plastic self-watering planter with reservoir',
			type: 'PlanterPot',
		},
		{
			id: 'e8',
			name: 'Peace Lily',
			description: 'Spathiphyllum, thrives in shaded corners',
			type: 'Plant',
		},
		{
			id: 'e9',
			name: 'Concrete Cube Pot',
			description: 'Modern gray concrete cube, 20 cm',
			type: 'PlanterPot',
		},
		{
			id: 'e10',
			name: 'Pothos Golden',
			description: 'Trailing pothos, great for shelves',
			type: 'Plant',
		},
	];

	listEntities(condition: (entity: Entity) => boolean) {
		return this.entities.filter(condition);
	}
}
