<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockOutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sparepart_id' => ['required', 'integer', 'exists:spareparts,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'usage_type' => ['required', 'string', 'in:service,sales,adjustment'],
            'reference_number' => ['nullable', 'string', 'max:100'],
            'transaction_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
