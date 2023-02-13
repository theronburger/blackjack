/**
 * Generate a pseudo UUID based on Date.now() & some random numbers
 * IE '1675968446341-7789434'
 */
const uuid = () => {
	return `${Date.now()}-${(Math.random() * 10000000).toFixed()}`;
};
