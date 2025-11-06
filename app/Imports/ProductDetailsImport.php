<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Validator;

class ProductDetailsImport implements ToCollection, WithHeadingRow
{
    public $errors = [];

    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            $validator = Validator::make($row->toArray(), [
                'item_code' => 'required|string',
                'name' => 'required|string',
                'model' => 'nullable|string',
                'description' => 'nullable|string',
                'hedding' => 'nullable|string',
                'warranty' => 'nullable|string',
                'specification' => 'nullable|string',
                'tags' => 'nullable|string',
                'youtube_video_id' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                $this->errors[] = [
                    'row' => $index + 2,
                    'errors' => $validator->errors()->all(),
                ];
            }
        }
    }
}
