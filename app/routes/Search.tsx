import type {Route} from "../../.react-router/types/app/routes/+types/Search";
import {key} from "~/key"
import {Alert, AlertDescription, AlertTitle} from "~/components/ui/alert";
import {useNavigate, useRouteError} from "react-router";
import {Item, ItemDescription, ItemHeader, ItemTitle} from "~/components/ui/item";
import {Cloud, CloudFog, CloudRain, CloudSnow, Droplet, Sun, Thermometer, Wind} from "lucide-react";
import {ScrollArea, ScrollBar} from "~/components/ui/scroll-area";
import {CardDescription} from "~/components/ui/card";
import {Separator} from "~/components/ui/separator";

interface Day {
    temp: number;
    humidity: number;
    icon: string;
    datetime: string;
    windspeed: number;
    precip: number;
    conditions: string;
}

interface WeatherApiResponse {
    address: string;
    days: Day[];
}

function getWeatherIcon(weather: string) {
    return weather === "snow" ?
        <CloudSnow/> :
        weather === "rain" ?
            <CloudRain/> :
            weather === "fog" ?
                <CloudFog/> :
                weather === "wind" ?
                    <Wind/> :
                    weather === "cloudy" ?
                        <Cloud/> : <Sun/>
}

export async function clientLoader({params,}: Route.ClientLoaderArgs) {
    const city = params.city as string;
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/next10days?unitGroup=metric&key=${key}`);

    if (response.ok) {
        return await response.json() as WeatherApiResponse;
    } else {
        throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
    }


}

export default function Search({loaderData}: Route.ComponentProps) {
    const data = loaderData;
    const navigate = useNavigate();

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const city = formData.get("search") as string;
        if (city) {
            navigate(`/${city}`);
        }
    }

    return <>

        <Item variant="outline">
            <ItemHeader><ItemTitle className="text-xl">
                {data.address.charAt(0).toUpperCase() + data.address.slice(1)}
            </ItemTitle></ItemHeader>
            <Separator className="md:hidden"/>
            <ItemDescription className="flex justify-between w-full flex-col md:flex-row gap-6">
                <div className="font-semibold text-lg flex flex-col gap-2">
                    <div className="flex items-center gap-1"><Thermometer/>{data.days[0].temp}°C</div>
                    <div
                        className="flex items-center gap-1">{getWeatherIcon(data.days[0].icon)}{data.days[0].conditions}</div>
                </div>
                <Separator className="md:hidden"/>
                <div className="flex-col flex gap-2">
                    <div className="flex gap-1"><Droplet/>
                        <div className="flex justify-between grow gap-2">
                            <div>Humidity:</div>
                            <p>{data.days[0].humidity}%</p>
                        </div>
                    </div>
                    <div className="flex gap-1"><Wind/>
                        <div className="flex justify-between grow gap-2">
                            <div>Wind speed:</div>
                            <div>{data.days[0].windspeed}km/h</div>
                        </div>
                    </div>
                    <div className="flex gap-1"><CloudRain/>
                        <div className="flex justify-between grow gap-2">
                            <div>Precipitation:</div>
                            <div>{(data.days[0].precip).toFixed(1)}mm</div>
                        </div>
                    </div>
                </div>
            </ItemDescription>
            <Separator className="md:hidden"/>
            <CardDescription>Next 10 Days Recap:</CardDescription>
            <ScrollArea className="w-full py-4 mt-[-1rem]">
                <div className="flex gap-2 max-w-max">{data.days.map((day: Day, index: number) => (
                    <Item key={index} variant="outline" className="flex flex-col items-start">
                        <div className="flex gap-2 w-full items-center justify-between text-gray-500">
                            {getWeatherIcon(day.icon)}
                            {new Date(day.datetime).toLocaleDateString(undefined, {
                                day: 'numeric',
                                month: 'numeric'
                            },).split('/')
                                .map(elem => elem.padStart(2, '0'))
                                .reverse()
                                .join('.')}
                        </div>
                        <div className="flex gap-2 items-center justify-between w-full text-red-500">
                            <Thermometer/>{day.temp}°C
                        </div>
                        <div className="flex gap-2 items-center justify-between w-full text-blue-500">
                            <Droplet/>{day.humidity}%
                        </div>
                    </Item>))}</div>
                <ScrollBar orientation="horizontal"></ScrollBar>
            </ScrollArea>
        </Item>
    </>
}

export function ErrorBoundary() {
    const error = useRouteError();
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";


    return (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
    );
}