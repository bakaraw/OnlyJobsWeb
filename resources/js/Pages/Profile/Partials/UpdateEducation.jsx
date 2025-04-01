import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function UpdateEducation({ className }) {

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Education
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your education
                </p>
            </header>
            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className='grid grid-cols-6 gap-3'>
                    <div className='col-span-4'>
                        <InputLabel htmlFor="wow" value="Education Level" />
                        <TextInput className="mt-1 block w-full">
                        </TextInput>
                    </div>
                    <div className='col-span-1'>
                        <InputLabel htmlFor="wow" value="Start Year" />
                        <TextInput className="mt-1 block w-full">
                        </TextInput>
                    </div>
                    <div className='col-span-1'>
                        <InputLabel htmlFor="wow" value="End Year" />
                        <TextInput className="mt-1 block w-full">
                        </TextInput>
                    </div>
                </div>
                <div>
                    <InputLabel htmlFor="wow" value="School/University" />
                    <TextInput className="mt-1 block w-full"></TextInput>
                </div>
                <div>
                    <InputLabel htmlFor="wow" value="Course/Program" />
                    <TextInput className="mt-1 block w-full"></TextInput>
                </div>
            </form>
        </section>
    );
}
