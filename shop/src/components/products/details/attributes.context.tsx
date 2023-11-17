import {createContext, useContext, useMemo, useState} from "react";

type State = typeof initialState;
const initialState = {};
export const AttributesContext = createContext<State | any>(initialState);

AttributesContext.displayName = 'AttributesContext';

export const AttributesProvider: React.FC<{
  children?: React.ReactNode;
}> = (props) => {
  const [state, dispatch] = useState(initialState);
  const value = useMemo(
    () => ({ attributes: state, setAttributes: dispatch }),
    [state]
  );
  return <AttributesContext.Provider value={value} {...props} />;
};

export const useAttributes = () => {
  const context = useContext(AttributesContext);
  if (context === undefined) {
    throw new Error(`useAttributes must be used within a SettingsProvider`);
  }
  return context;
};
