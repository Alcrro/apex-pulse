import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useNutritionTarget } from "../hooks/useNutritionTarget";
import { useNutritieSetariStore } from "../stores/nutritieSetariStore";
import { CalorieGoalSection } from "../components/setari/CalorieGoalSection";
import { MacroSplitSection } from "../components/setari/MacroSplitSection";
import { WaterTargetSection } from "../components/setari/WaterTargetSection";
import { NutritionInfoSection } from "../components/setari/NutritionInfoSection";

export function NutritieSetariPage() {
	const navigate = useNavigate();
	const {
		goals,
		loading,
		avgCalories,
		setGoalType,
		setManualCalories,
		setCustomMacroSplit,
	} = useNutritionTarget();
	const syncExternal = useNutritieSetariStore((s) => s.syncExternal);

	useEffect(() => {
		syncExternal(goals, avgCalories, loading, {
			setGoalType,
			setManualCalories,
			setCustomMacroSplit,
		});
	}, [goals, avgCalories, loading]); // eslint-disable-line react-hooks/exhaustive-deps — Supabase fns sunt stabile

	return (
		<div className="pb-8">
			<div className="flex items-center gap-3 py-3 mb-2">
				<button
					onClick={() => navigate(-1)}
					className="p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors -ml-1"
				>
					<ArrowLeft size={20} />
				</button>
				<h1 className="text-lg font-bold text-white">Setări nutriție</h1>
			</div>

			<div className="space-y-6">
				<CalorieGoalSection />
				<MacroSplitSection />
				<WaterTargetSection />
				<NutritionInfoSection />
			</div>
		</div>
	);
}
