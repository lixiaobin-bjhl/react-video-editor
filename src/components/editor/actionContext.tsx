// actionContext.tsx
import React, { createContext, useContext } from 'react';

const ActionContext = createContext(null);

export const ActionProvider = ({ children, handleAction, downloadMp4 }) => {
	const actions = {
		handleAction,
		downloadMp4
	};

	return (
		<ActionContext.Provider value={actions}>
			{children}
		</ActionContext.Provider>
	);
};

export const useAction = () => {
	return useContext(ActionContext);
};