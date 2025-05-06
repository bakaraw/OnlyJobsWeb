import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export default function AddressForm({ className, data, setData, errors }) {
    console.log("address form", data)
    return (
        <div className={className}>
            <div className='mt-4'>
                <InputLabel htmlFor="address" value="Address" />
                <div className='grid grid-cols-2 gap-3'>
                    <div className='col-span-1'>
                        <TextInput
                            id="street"
                            name="street"
                            placeholder="Street Address"
                            value={data.street}
                            className="mt-1 block w-full"
                            autoComplete="street"
                            onChange={(e) => setData('street', e.target.value)}
                        />
                        <InputError message={errors.street} className="mt-2" />
                    </div>
                    <div className='col-span-1'>
                        <TextInput
                            id="street2"
                            name="street2"
                            placeholder="Street Address Line 2"
                            value={data.street2}
                            className="mt-1 block w-full"
                            autoComplete="street2"
                            onChange={(e) => setData('street2', e.target.value)}
                        />
                        <InputError message={errors.street2} className="mt-2" />
                    </div>
                </div>
            </div>

            <div className='mt-3 grid grid-cols-9 gap-3'>
                <div className='col-span-3'>
                    <div className='col-span-1'>
                        <TextInput
                            id="city"
                            name="city"
                            placeholder="City"
                            value={data.city}
                            className="mt-1 block w-full"
                            autoComplete="city"
                            onChange={(e) => setData('city', e.target.value)}
                        />
                        <InputError message={errors.city} className="mt-2" />
                    </div>
                </div>
                <div className='col-span-3'>
                    <TextInput
                        id="province"
                        name="province"
                        placeholder="State/Province"
                        value={data.province}
                        className="mt-1 block w-full"
                        autoComplete="province"
                        onChange={(e) => setData('province', e.target.value)}
                    />
                    <InputError message={errors.province} className="mt-2" />
                </div>
                <div className='col-span-3'>
                    <TextInput
                        id="postal_code"
                        name="postal_code"
                        placeholder="Postal Code"
                        value={data.postal_code}
                        className="mt-1 block w-full"
                        autoComplete="postal_code"
                        onChange={(e) => setData('postal_code', e.target.value)}
                    />
                    <InputError message={errors.postal_code} className="mt-2" />
                </div>
            </div>

            <div className='w-full mt-3'>
                <TextInput
                    id="country"
                    name="country"
                    placeholder="Country"
                    value={data.country}
                    className="mt-1 block w-full"
                    autoComplete="country"
                    onChange={(e) => setData('country', e.target.value)}
                />
                <InputError message={errors.country} className="mt-2" />
            </div>

        </div>
    );

}
