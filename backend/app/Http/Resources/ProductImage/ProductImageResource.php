<?php

namespace App\Http\Resources\ProductImage;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'provider' => $this->provider,
            'public_id' => $this->public_id,
            'url' => $this->url,
            'format' => $this->format,
            'width' => $this->width,
            'height' => $this->height,
            'bytes' => $this->bytes,
        ];
    }
}
