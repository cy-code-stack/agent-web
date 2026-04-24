<?php

namespace App\Http\Requests\Agent;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAgentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['sometimes', 'string', 'max:100'],
            'last_name' => ['sometimes', 'string', 'max:100'],
            'middle_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'gender' => ['sometimes', 'nullable', 'in:male,female,other'],
            'contact_number' => ['sometimes', 'nullable', 'string', 'max:20'],
            'agent_phone_num' => ['sometimes', 'nullable', 'string', 'max:20'],
            'agent_landline' => ['sometimes', 'nullable', 'string', 'max:20'],
            'email' => ['sometimes', 'email', 'max:255'],
            'agent_country' => ['sometimes', 'nullable', 'string', 'max:100'],
            'agent_region' => ['sometimes', 'nullable', 'string', 'max:100'],
            'agent_province' => ['sometimes', 'nullable', 'string', 'max:100'],
            'agent_city_mul' => ['sometimes', 'nullable', 'string', 'max:100'],
            'agent_brgy' => ['sometimes', 'nullable', 'string', 'max:100'],
            'agent_street' => ['sometimes', 'nullable', 'string', 'max:255'],
            'agent_zip_code' => ['sometimes', 'nullable', 'string', 'max:10'],
            'pag_ibig_id' => ['sometimes', 'nullable', 'string', 'max:50'],
            'tin' => ['sometimes', 'nullable', 'string', 'max:50'],
        ];
    }
}
