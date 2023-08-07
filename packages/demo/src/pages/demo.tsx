import { useFlatInject } from "../stores";

export default () => {
	const { info } = useFlatInject("appStore")[0];
	return <div>{info}</div>;
};
