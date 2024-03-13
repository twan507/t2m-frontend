'use client'
import { sendRequest } from '@/utlis/api';
import { Modal, Input, notification, Form, Select, Button, InputNumber } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

interface IProps {
    isImageModalOpen: boolean
    setIsImageModalOpen: (v: boolean) => void
    updateLicenseRecord: any
}

const ImageLicenseModal = (props: IProps) => {

    const { data: session } = useSession()

    const { isImageModalOpen, setIsImageModalOpen, updateLicenseRecord } = props

    const handleClose = () => {
        setIsImageModalOpen(false)
    }

    const getImage = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `http://localhost:8000/api/v1/files`,
            method: "GET",
            headers: { 'Authorization': `Bearer ${session?.access_token}` },
            queryParams: { fileName: updateLicenseRecord.userEmail, module: 'licenses' },
        })
        console.log(res)
    }
    getImage()
    // useEffect(() => {
    //     getImage()
    //   }, [session])

    return (
        <>
            <Modal
                open={isImageModalOpen}
                onCancel={handleClose}
                closeIcon={null}
                footer={null}
            >


            </Modal>
        </>

    )
}

export default ImageLicenseModal