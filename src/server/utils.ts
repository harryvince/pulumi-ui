export const wrapResult = (success: boolean, value: any) => {
	return {
		success,
		value,
	};
};
