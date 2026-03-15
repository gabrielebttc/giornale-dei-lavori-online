import { useEffect } from "react";

type EditDocumentComponentProps = {
    documentAlreadyExist: boolean
};

export default function EditDocumentComponent ({ documentAlreadyExist }: EditDocumentComponentProps) {

    useEffect(() => {
        if(documentAlreadyExist) {
            
        }
    }, [documentAlreadyExist]);

    return (
        <>
            <h1>Modifica documento</h1>
        </>
    )
}