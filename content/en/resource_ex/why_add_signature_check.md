# ID signature verification

ResourceEx uses IDs to distinguish resources such as characters, ingredients, dishes, recipes, and beverages. When two resource packs reuse the same ID, the game may load the wrong content. The managed ID ranges and the signature mechanism reduce these conflicts.

A signature means that a certain `label` is allowed to use an ID range; it does not mean MetaMystia endorses, supports, or recommends the content of that resource pack.

## ID ranges

| Range                        | Rule                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `-2147483648` to `8999`      | Reserved for the game; ResourceEx must not use                                                                |
| `9000` to `1073741823`       | Managed range; a valid range must be declared, and a valid signature is required when verification is enabled |
| `1073741824` to `2147483647` | Free range; no signature required, but conflicts are the creator's responsibility                             |

When a pack uses managed IDs, it must declare the range in `packInfo.idRangeStart` and `packInfo.idRangeEnd`. The start must not be greater than the end, and all managed IDs must fall inside the declared range. Packs that only use free-range IDs do not need these two fields.

## Applying for an ID range

You can submit the pack `label` and the consecutive ID range you want through any of these channels:

- QQ group: [1034953242](https://qm.qq.com/q/s0Qp3QPtOC)
- Email: [`MetaMiku@hotmail.com`](mailto:MetaMiku@hotmail.com)
- GitHub Issue: [MetaMystia Issues](https://github.com/MetaMystia/MetaMystia/issues)

Ranges are usually allocated in blocks of 1000:

$$
[1000n, 1000n+999],\quad n\in\mathbb{Z}
$$

If you need a larger range, explain the purpose and apply for a consecutive interval. Unless you extend the ID range or change the `label`, a signed pack does not need to apply again for version updates.

Before applying, check the [MetaMystia-ResourceEx ID allocation sheet](https://docs.qq.com/sheet/DV2NvRFVKYmJBWGVK) and avoid allocated ranges. The example pack `ResourceExample` currently uses `9000` to `12999`; third-party packs must not reuse it.

## What the signature covers

The signature binds the following UTF-8 text:

```text
label:idRangeStart-idRangeEnd
```

The loader verifies it with RSA-2048, SHA-256, and PKCS#1 v1.5 using a built-in public key. Changing the `label` or the ID range invalidates the original signature.

In the online editor, fill in the `label` and the ID range, then use the "Signature" feature to paste the approved signature string and save.

![Filling in the signature](./why_add_signature_check.assets/image-20260220093232888.png)

![Signature verification result](./why_add_signature_check.assets/image-20260220093511274.png)

## Temporary development and the free range

While waiting for a signature, you can set `SignatureCheck` to `false` in the `General` section of `BepInEx/config/MetaMystia.cfg`. This is only suitable for local development and debugging.

With signature verification off, the following rules still apply:

- IDs reserved for the game (`8999` and below) are forbidden;
- managed IDs must be inside the range declared by the pack;
- when managed IDs are used, the start and end range itself must be valid.

If you do not want to apply for a signature, you can use free-range IDs above `1073741824`. The free range does not resolve conflicts between different packs; publishers must coordinate among themselves.
