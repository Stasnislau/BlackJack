import { observer } from 'mobx-react-lite';
import { Context } from '../main';
import React, { ReactNode } from 'react';
const HighOrderComponent = observer(({ children }: {
    children: ReactNode;
}) => {
    const store = React.useContext(Context);

    return (
        <>
            {store.state.isLoading &&
                <div className="flex justify-center items-center fixed bottom-[10%] right-[10%]">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600" />
                </div>}
            {children}
        </>
    );
});

export default HighOrderComponent;