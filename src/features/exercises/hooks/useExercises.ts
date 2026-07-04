import { useEffect, useState } from "react";
import { supabase } from "../../../shared/lib/supabase";
import { useAuth } from "../../../shared/context/AuthContext";
import type { Exercise } from "../../../shared/types";

export function useExercises() {
	const { user } = useAuth();
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchExercises();
	}, [user]);

	async function fetchExercises() {
		const { data } = await supabase
			.from("exercises")
			.select("*")
			.or(`is_custom.eq.false,user_id.eq.${user?.id ?? "null"}`)
			.order("muscle_group")
			.order("name");
		setExercises((data as Exercise[]) ?? []);
		setLoading(false);
	}

	async function createCustomExercise(
		name: string,
		muscleGroup: string,
		equipment: string,
	) {
		const { data, error } = await supabase
			.from("exercises")
			.insert({
				name,
				muscle_group: muscleGroup,
				equipment,
				is_custom: true,
				user_id: user!.id,
			})
			.select()
			.single();
		if (!error) {
			setExercises((prev) =>
				[...prev, data as Exercise].sort((a, b) => a.name.localeCompare(b.name)),
			);
		}
		return { data: data as Exercise | null, error };
	}

	return { exercises, loading, createCustomExercise, refetch: fetchExercises };
}
