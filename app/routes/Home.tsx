import {CardContent} from "~/components/ui/card";
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {Search} from "lucide-react";
import {Field, FieldLabel} from "~/components/ui/field";
import {useNavigate} from "react-router";


export default function Home() {

    const navigate = useNavigate();

    function handleSearch(e: React.FormEvent<HTMLFormElement>){
e.preventDefault();

const formData = new FormData(e.currentTarget);
const city = formData.get("search") as string;
if  (city){
    navigate(`/${city}`);
}
    }

    return (
        <>
            <CardContent>
                <form onSubmit={handleSearch}>
                    <Field>
                        <FieldLabel htmlFor="search">Search a city</FieldLabel>
                        <div className="flex gap-2">
                            <Input id="search" name="search" type="text" placeholder="New York"/>
                            <Button size="icon" variant="outline" type="submit">
                                <Search/>
                            </Button>
                        </div>
                    </Field>
                </form>
            </CardContent>
        </>
    );
}