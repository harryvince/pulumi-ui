// biome-ignore lint/suspicious/noExplicitAny: tech-debt
export const wrapResult = (success: boolean, value: any) => {
	return {
		success,
		value,
	};
};
