import { ApexPulseLogo } from './ApexPulseLogo'

export function Spinner() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<ApexPulseLogo width={180} height={72} className="animate-pulse" />
		</div>
	);
}
