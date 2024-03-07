import React from "react";
import PropTypes from "prop-types";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import MDEditorRoot from "./MDEditorRoot";
import { useAppSelector } from "../../state/Hooks";
import { getDashboardState } from "../../state/contexts/dashboard/Selectors";

function MDEditor({ value }: any) {
    const { darkMode } = useAppSelector(getDashboardState);

    const [convertedContent, setConvertedContent] = React.useState(null);
    const [editorState, setEditorState] = React.useState(() =>
        EditorState.createEmpty()
    );

    React.useEffect(() => {
        let html = convertToHTML(editorState.getCurrentContent());
        setConvertedContent(html);
    }, [editorState]);

    return (
        <MDEditorRoot ownerState={{ darkMode }}>
            {value && typeof value === "function" && value(convertedContent)}
            <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
            />
        </MDEditorRoot>
    );
}

// Setting default values for the props of MDEditor
MDEditor.defaultProps = {
    value: () => {},
};

// Typechecking props for the MDEditor
MDEditor.propTypes = {
    value: PropTypes.func,
};

export default MDEditor;
