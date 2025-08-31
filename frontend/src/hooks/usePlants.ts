import { handleApiError } from "@/api/api";
import { getAllPlants, getPlantById } from "@/api/plants/route";
import { Plant } from "../types/types";
import { useCallback, useEffect, useState } from "react"

export const usePlants = () => {
	const [plants, setPlants] = useState<Plant[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPlants = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const data = await getAllPlants();

			setPlants(data);
		} catch (error) {
			setError(handleApiError(error));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchPlants();
	}, [fetchPlants])

	return {
		plants,
		loading,
		error,
		refetch: fetchPlants,
	};
};

export const usePlant = (plantID: number) => {
	const [plant, setPlant] = useState<Plant | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPlantById = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const data = await getPlantById(plantID);
			setPlant(data);
		} catch (error) {
			setError(handleApiError(error));
		} finally {
			setLoading(false);
		}
	}, [plantID]);

	useEffect(() => {
		fetchPlantById();
	}, [fetchPlantById]);

	return {
		plant,
		loading,
		error,
		refetch: fetchPlantById,
	}
};

