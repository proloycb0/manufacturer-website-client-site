import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import Loading from '../Shared/Loading/Loading';
import OrderCancelConfirm from './OrderCancelConfirm';

const ManageOrders = () => {
    const [cancelOrder, setCancelOrder] = useState(null);
    const { data: orders, isLoading, refetch } = useQuery('orders', () => fetch(`https://secure-wildwood-96014.herokuapp.com/orders`, {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
        .then(res => res.json())
    );

    if (isLoading) {
        return <Loading />
    }

    const handleShipped = (id) => {


        // update quantity 
        // const url = `https://secure-wildwood-96014.herokuapp.com/updateQuantity/${id}`;
        // fetch(url, {
        //     method: "PUT",
        //     headers: {
        //         "content-type": "application/json",
        //     },
        //     body: JSON.stringify({ updatedQuantity }),
        // })
        //     .then(res => res.json())
        //     .then(data => {
        //         refetch();
        //     });

        const payment = { status: "shipped" }
        fetch(`https://secure-wildwood-96014.herokuapp.com/orders/${id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(payment)
        })
            .then(res => res.json())
            .then(data => {
                refetch();
                toast('Shipped successfull')
                console.log(data)
            })
    }
    return (
        <div>
            <h2 className='text-2xl'>Manage All Orders: {orders?.length}</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Info</th>
                            <th>Product</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders?.map((order, index) => <tr key={order._id}>
                                <th>{index + 1}</th>
                                <td>OrderId: {order._id}</td>
                                <td>{order.product}</td>
                                <td>{order.price}</td>
                                <td>{order.status}</td>
                                <td>
                                    {order.status === "pending" ? <button onClick={() => handleShipped(order._id)} className='btn btn-xs btn-primary'>Shipped</button> : <button className='btn btn-xs disabled'>Shipped</button>}
                                    {!order.paid ? <label onClick={() => setCancelOrder(order)} htmlFor="cancel-confirm-modal" className='btn btn-xs btn-error'>Cancel</label> : <button className='btn btn-xs' disabled>Cancel</button>}
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
            {
                cancelOrder && <OrderCancelConfirm
                    cancelOrder={cancelOrder}
                    setCancelOrder={setCancelOrder}
                    refetch={refetch}
                />
            }
        </div>
    );
};

export default ManageOrders;