import React, { useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import auth from '../../firebase.init';

const AddReview = () => {
    const [user] = useAuthState(auth);

    const ratingRef = useRef('')
    const descriptionRef = useRef('')
    const handleSubmit = (event) => {
        event.preventDefault();
        const rating = ratingRef.current.value;
        const description = descriptionRef.current.value;
        const review = {
            name: user.displayName,
            rating: rating,
            description: description
        }
        fetch('http://localhost:5000/review', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(review)
        })
            .then(res => res.json())
            .then(data => {
                toast.success('Review added successfully');
                event.target.reset();
            })
    }
    return (
        <div>
            <h1 className='text-xl'>Please add a review</h1>
            <form className='mt-5' onSubmit={handleSubmit}>
                <div class="form-control w-full max-w-xs">
                    <label class="label">
                        <span class="label-text">Rating</span>
                    </label>
                    <input type="text" ref={ratingRef} placeholder="Rating" class="input input-bordered w-full max-w-xs" />
                </div>
                <div class="form-control w-full max-w-xs">
                    <label class="label">
                        <span class="label-text">Description</span>
                    </label>
                    <textarea type="text" ref={descriptionRef} placeholder="Description" class="textarea textarea-bordered w-full max-w-xs" />
                </div>
                <input className='btn btn-primary w-full max-w-xs mt-3' type="submit" value="Add Review" />
            </form>
        </div>
    );
};

export default AddReview;