import { useSelector } from "0i0";
import React, { forwardRef, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid'

const Portal = new Proxy(
	{} as any, {
	get: (_, name) => forwardRef((props, ref) => {
		const isExist = useSelector(state => state.componentMap[name] !== undefined)
		const stateId = useSelector(state => (state.componentMap[name].instanceList.find(({ visible }) => !visible) || {}).id)
		const [id] = useState(() => stateId || uuid());
		// 这里需要利用之前的id， 然后保证
		const dispatch = useSelector(state => state.dispatch);
		// 首先查看是否有visible 为 false的instance
		// 如果有， 则置为true, 如果没有, 则重新创建一个新的instance
		// 
		useEffect(() => {
			if (isExist) {
				dispatch({ type: 'mount', name, id, props, ref })
				return () => {
					dispatch({ type: 'disable', name, id })
				}
			}
		}, [dispatch, isExist])

		useEffect(() => {
			if (isExist) {
				dispatch({ type: 'updateProps', name, id, props })
			}
		}, [dispatch, id, isExist, props])

		useEffect(() => {
			if (isExist) {
				dispatch({ type: 'updateRef', name, id, ref })
			}
		}, [dispatch, id, isExist, ref])
		if (isExist) {
			return <div id={id} />;
		} else {
			return null;
		}
	})
}
)

export default Portal;
