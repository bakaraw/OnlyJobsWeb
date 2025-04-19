<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class LightcastController extends Controller
{
    private function getAccessToken()
    {
        return Cache::remember('lightcast_token', 3500, function () {
            $response = Http::asForm()->post(env('LIGHTCAST_AUTH_URL'), [
                'client_id' => env('LIGHTCAST_CLIENT_ID'),
                'client_secret' => env('LIGHTCAST_CLIENT_SECRET'),
                'grant_type' => 'client_credentials',
                'scope' => env('LIGHTCAST_SCOPE'),
            ]);

            if ($response->successful()) {
                return $response->json()['access_token'];
            }

            throw new \Exception('Unable to authenticate with Lightcast.');
        });
    }

    public function fetchSkills(Request $request)
    {
        $query = $request->input('q');
        $token = $this->getAccessToken();

        $response = Http::withToken($token)
            ->get("https://emsiservices.com/skills/versions/latest/skills", [
                'q' => $query
            ]);

        if ($response->successful()) {
            return response()->json($response->json());
        }

        return response()->json(['error' => 'Error fetching skills'], 500);
    }
}
