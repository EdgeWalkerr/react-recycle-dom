import { ElementType, MutableRefObject, ReactNode, useMemo, useReducer } from 'react'
import React from 'react'
import { Provider as ContextProvider } from '0i0'
import Soul from './Soul'

function reducer(state: any, action: any) {
	switch (action.type) {
		case 'mount': {
			const { name, id, props, ref } = action;
			// 查看是否有闲置的相同的item, 如果有，将visible 设置为true
			const index = state[name].instanceList.findIndex(({ id: originId }: { id: string }) => id === originId);
			if (index !== -1) {
				state[name] = {
					...state[name],
					instanceList: [...state[name].instanceList]
				}
				state[name].instanceList[index] = {
					...state[name].instanceList[index],
					visible: true,
				}
				return {
					...state,
				}
			}
			state[name] = {
				...state[name],
				instanceList: [...state[name].instanceList, {
					component: state[name].component,
					visible: true,
					name,
					expire: state[name].expire,
					id,
					props,
					ref
				}]
			}
			return {
				...state,
			}
		}

		case 'disable': {
			const { name, id } = action;
			state[name] = {
				...state[name],
				instanceList: [...state[name].instanceList].map((item) => item.id === id ? ({ ...item, visible: false }) : item)
			}
			return {
				...state,
			}
		}

		case 'unmount': {
			const { name, id } = action;
			state[name] = {
				...state[name],
				instanceList: [...state[name].instanceList].filter((item) => item.id !== id)
			}
			return {
				...state,
			}
		}

		case 'updateProps': {
			const { name, id, props } = action;
			state[name] = {
				...state[name],
				instanceList: [...state[name].instanceList].map((item) => item.id === id ? ({ ...item, props }) : item)
			}
			return {
				...state,
			}
		}

		case 'updateRef': {
			const { name, id, ref } = action;
			state[name] = {
				...state[name],
				instanceList: [...state[name].instanceList].map((item) => item.id === id ? ({ ...item, ref }) : item)
			}
			return {
				...state,
			}
		}

		default:
			return state;
	}
}

interface IItemPropType {
	component: ElementType<any>
	name: string
	visible: boolean
	expire: number
	id: string
	props: Object
	ref?: MutableRefObject<any>
}

const Item = ({ component: Component, name, visible, expire, id, props, ref }: IItemPropType) => {
	const Children = useMemo(() => <Component {...props} ref={ref} />, [props, ref])
	return (
		<Soul name={name} visible={visible} id={id} expire={expire}>
			{ Children}
		</Soul>
	)
}

export default function Provider({ componentMap, expire = 60, children }: { componentMap: { [key: string]: any }, children: ReactNode, expire?: number }) {
	const [newComponentMap, dispatch] = useReducer(reducer, undefined, () => Object.keys(componentMap).reduce((result, name) => ({
		...result,
		[name]: {
			component: componentMap[name],
			expire,
			instanceList: [],
		}
	}), {}))
	return (
		<ContextProvider value={{ componentMap: newComponentMap, dispatch }}>
			{
				(Object.values(newComponentMap).reduce((result: any[], { instanceList }: any) => [...result, ...instanceList], [] as any[]) as any[]).map(({ id, ...componentInfo }: any) => <Item key={id} id={id} expire={expire} {...componentInfo} />)
			}
			{children}
		</ContextProvider>
	)
}