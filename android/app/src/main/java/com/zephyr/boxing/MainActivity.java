package com.zephyr.boxing;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends BridgeActivity {

    private static final int PERMISSION_REQUEST_CODE = 100;
    private static final String[] VISION_PERMISSIONS = new String[]{
        Manifest.permission.CAMERA,
        Manifest.permission.RECORD_AUDIO
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Force browser-style permission prompts by only asking when getUserMedia is called in JS
        /* 
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            requestVisionPermissionsIfNeeded();
        }
        */
    }

    private void requestVisionPermissionsIfNeeded() {
        List<String> toRequest = new ArrayList<>();
        for (String perm : VISION_PERMISSIONS) {
            if (ContextCompat.checkSelfPermission(this, perm) != PackageManager.PERMISSION_GRANTED) {
                toRequest.add(perm);
            }
        }
        if (!toRequest.isEmpty()) {
            ActivityCompat.requestPermissions(this,
                toRequest.toArray(new String[0]), PERMISSION_REQUEST_CODE);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
            @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode != PERMISSION_REQUEST_CODE) return;
        // Result is handled by the WebView when it calls getUserMedia; no need to redirect here.
    }
}
