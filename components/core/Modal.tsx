import { Box, Modal } from '@mui/material';
import type { ModalProps } from '@mui/material/Modal';

interface ModalBoxStyle {
    position: 'absolute' | 'relative' | 'fixed' | 'sticky' | 'static' | 'inherit' | 'initial' | 'unset';
    top: string;
    left: string;
    transform: string;
    width: string;
    bgcolor: string;
    borderRadius: number;
    boxShadow: number;
    p: number;
}

interface OurModalProps extends ModalProps {
    cardStyle?: ModalBoxStyle;
}

function OurModal(props: OurModalProps) {
    const modalBoxStyle: ModalBoxStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'clamp(300px, 80vw, 600px)',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
    };
    let { cardStyle, ...otherProps } = props;
    cardStyle = cardStyle ? cardStyle : modalBoxStyle;
    return (
        <Modal {...otherProps}>
            <Box sx={cardStyle}>
                {props.children}
            </Box>
        </Modal>
    );
}

export {
    OurModal as Modal,
    type ModalBoxStyle as ModalStyle,
}